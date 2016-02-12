using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using NUnit.Framework;
using ServiceStack;
using ServiceStack.Admin.WebHost;
using ServiceStack.Data;
using ServiceStack.OrmLite;

namespace Admin.Tasks
{
    [TestFixture]
    public class GitHubTasks
    {
        private IDbConnectionFactory dbFactory;
        const string githubUser = "ServiceStack";
        const string githubRepo = "ServiceStack";

        [OneTimeSetUp]
        public void OneTimeSetUp()
        {
            dbFactory = new OrmLiteConnectionFactory(Config.ConnectionString, SqliteDialect.Provider);
        }

        [Test]
        public void Import_from_GitHub()
        {
            using (var db = dbFactory.OpenDbConnection())
            {
                db.DropAndCreateTable<GithubRepo>();
                db.DropAndCreateTable<GithubCommit>();
                db.DropAndCreateTable<GithubContent>();
                db.DropAndCreateTable<GithubContributor>();
                db.DropAndCreateTable<GithubSubscriber>();
                db.DropAndCreateTable<GithubComment>();
                db.DropAndCreateTable<GithubRelease>();

                var gateway = new GithubGateway
                {
                    Username = "{USER}",
                    Password = "{PASS}",
                };

                var allRepos = gateway.GetAllUserAndOrgsReposFor(githubUser);

                db.InsertAll(allRepos);

                var commitResponses = gateway.GetRepoCommits(githubUser, githubRepo)
                    .Take(1000)
                    .ToList();

                var commits = commitResponses.Select(x => {
                    x.Commit.Id = x.Sha;
                    x.Commit.Date = x.Commit.Committer.Date;
                    x.Commit.Name = x.Commit.Committer.Name;
                    return x.Commit;
                });
                db.InsertAll(commits);

                var repoContents = gateway.GetRepoContents(githubUser, githubRepo);
                db.InsertAll(repoContents);

                var repoContributors = gateway.GetRepoContributors(githubUser, githubRepo);
                db.InsertAll(repoContributors);

                var repoSubscribers = gateway.GetRepoSubscribers(githubUser, githubRepo);
                db.InsertAll(repoSubscribers);

                var repoComments = gateway.GetRepoComments(githubUser, githubRepo);
                db.InsertAll(repoComments);

                var repoReleases = gateway.GetRepoReleases(githubUser, githubRepo);
                db.InsertAll(repoReleases);
            }
        }
    }

    public partial class GithubGateway
    {
        public const string GithubApiBaseUrl = "https://api.github.com/";
        public static string UserAgent = typeof(GithubGateway).Namespace.SplitOnFirst('.').First();

        public string Username { get; set; }
        public string Password { get; set; }

        protected virtual void RequestFilter(HttpWebRequest req)
        {
            req.UserAgent = UserAgent;

            if (!string.IsNullOrEmpty(Username) && !string.IsNullOrEmpty(Password))
            {
                req.Headers.Add("Authorization", "Basic " +
                    Convert.ToBase64String(Encoding.ASCII.GetBytes(Username + ":" + Password)));
            }
        }

        public T GetJson<T>(string route, params object[] routeArgs)
        {
            return GithubApiBaseUrl.CombineWith(route.Fmt(routeArgs))
                .GetJsonFromUrl(RequestFilter)
                .FromJson<T>();
        }

        public IEnumerable<T> StreamJsonCollection<T>(string route, params object[] routeArgs)
        {
            List<T> results;
            var nextUrl = GithubApiBaseUrl.CombineWith(route.Fmt(routeArgs));

            do
            {
                results = nextUrl
                    .GetJsonFromUrl(
                        RequestFilter,
                        responseFilter: res => {
                            var links = ParseLinkUrls(res.Headers["Link"]);
                            links.TryGetValue("next", out nextUrl);
                        })
                    .FromJson<List<T>>();

                foreach (var result in results)
                {
                    yield return result;
                }

            } while (results.Count > 0 && nextUrl != null);
        }

        public static Dictionary<string, string> ParseLinkUrls(string linkHeader)
        {
            var map = new Dictionary<string, string>();
            var links = linkHeader;

            while (!string.IsNullOrEmpty(links))
            {
                var urlStartPos = links.IndexOf('<');
                var urlEndPos = links.IndexOf('>');

                if (urlStartPos == -1 || urlEndPos == -1)
                    break;

                var url = links.Substring(urlStartPos + 1, urlEndPos - urlStartPos - 1);
                var parts = links.Substring(urlEndPos).SplitOnFirst(',');

                var relParts = parts[0].Split(';');
                foreach (var relPart in relParts)
                {
                    var keyValueParts = relPart.SplitOnFirst('=');
                    if (keyValueParts.Length < 2)
                        continue;

                    var name = keyValueParts[0].Trim();
                    var value = keyValueParts[1].Trim().Trim('"');

                    if (name == "rel")
                    {
                        map[value] = url;
                    }
                }

                links = parts.Length > 1 ? parts[1] : null;
            }

            return map;
        }
    }

    public partial class GithubGateway
    {
        public List<GithubOrg> GetUserOrgs(string githubUsername)
        {
            return GetJson<List<GithubOrg>>("users/{0}/orgs", githubUsername);
        }

        public List<GithubRepo> GetUserRepos(string githubUsername)
        {
            return GetJson<List<GithubRepo>>("users/{0}/repos", githubUsername);
        }

        public List<GithubRepo> GetOrgRepos(string githubOrgName)
        {
            return GetJson<List<GithubRepo>>("orgs/{0}/repos", githubOrgName);
        }

        public List<GithubRepo> GetAllUserAndOrgsReposFor(string githubUsername)
        {
            var map = new Dictionary<int, GithubRepo>();
            GetUserRepos(githubUsername).ForEach(x => map[x.Id] = x);
            GetUserOrgs(githubUsername).ForEach(org =>
                GetOrgRepos(org.Login)
                    .ForEach(repo => map[repo.Id] = repo));

            return map.Values.ToList();
        }

        public IEnumerable<GithubCommitResult> GetRepoCommits(string githubUser, string githubRepo)
        {
            return StreamJsonCollection<GithubCommitResult>("repos/{0}/{1}/commits", githubUser, githubRepo);
        }

        public List<GithubContent> GetRepoContents(string githubUser, string githubRepo)
        {
            return GetJson<List<GithubContent>>("repos/{0}/{1}/contents", githubUser, githubRepo);
        }

        public List<GithubContributor> GetRepoContributors(string githubUser, string githubRepo)
        {
            return GetJson<List<GithubContributor>>("repos/{0}/{1}/contributors", githubUser, githubRepo);
        }

        public List<GithubSubscriber> GetRepoSubscribers(string githubUser, string githubRepo)
        {
            return GetJson<List<GithubSubscriber>>("repos/{0}/{1}/subscribers", githubUser, githubRepo);
        }

        public List<GithubComment> GetRepoComments(string githubUser, string githubRepo)
        {
            return GetJson<List<GithubComment>>("repos/{0}/{1}/comments", githubUser, githubRepo);
        }

        public List<GithubRelease> GetRepoReleases(string githubUser, string githubRepo)
        {
            return GetJson<List<GithubRelease>>("repos/{0}/{1}/releases", githubUser, githubRepo);
        }
    }
}