using System;
using ServiceStack.DataAnnotations;

namespace ServiceStack.Admin.WebHost
{
    [Route("/repos")]
    [AutoQueryViewer(Name = "ServiceStack Repo's",
        Title = "ServiceStack Repositories", Description = "Browse different ServiceStack repos",
        DefaultSearchField = "Language", DefaultSearchType = "=", DefaultSearchText = "C#",
        IconUrl = "octicon:repo",
        DefaultFields = "Id,Name,Language,Description:500,Homepage,Has_Wiki")]
    public class QueryRepos : QueryDb<GithubRepo> { }

    [Route("/commits")]
    [AutoQueryViewer(Title = "ServiceStack Commits", Description = "Browse latest 1000 commits",
        DefaultSearchField = "Message", DefaultSearchType = "Contains", DefaultSearchText = "AutoQuery",
        //IconUrl = "octicon:history"
        IconUrl = "https://raw.githubusercontent.com/ServiceStackApps/GitHubAutoQuery/master/src/GitHubAutoQuery/GitHubAutoQuery/img/app/commits-75.png"
        )]
    public class QueryRepoCommits : QueryDb<GithubCommit> { }

    [Route("/contents")]
    [AutoQueryViewer(Title = "ServiceStack Files", Description = "Browse ServiceStack top-level files and folders",
        DefaultSearchField = "Type", DefaultSearchType = "=", DefaultSearchText = "file",
        IconUrl = "octicon:file-directory")]
    public class QueryRepoContent : QueryDb<GithubContent> { }

    [Route("/contributors")]
    [AutoQueryViewer(Title = "ServiceStack Contributors", Description = "Browse ServiceStack Contributors",
        DefaultSearchField = "Contributions", DefaultSearchType = ">=", DefaultSearchText = "5",
        IconUrl = "octicon:organization")]
    public class QueryRepoContributors : QueryDb<GithubContributor> { }

    [Route("/subscribers")]
    [AutoQueryViewer(Title = "ServiceStack Subscribers", Description = "Browse ServiceStack Subscribers",
        DefaultSearchField = "Type", DefaultSearchType = "=", DefaultSearchText = "User",
        IconUrl = "octicon:eye")]
    public class QueryRepoSubscribers : QueryDb<GithubSubscriber> { }

    //[Route("/comments")]
    //[AutoQueryViewer(Title = "ServiceStack Comments", Description = "Browse ServiceStack Subscribers",
    //    DefaultSearchField = "Id", DefaultSearchType = ">", DefaultSearchText = "0",
    //    IconUrl = "octicon:comments")]
    public class QueryRepoComments : QueryDb<GithubComment> { }

    [Route("/releases")]
    [AutoQueryViewer(Title = "ServiceStack Releases", Description = "Browse ServiceStack Releases",
        DefaultSearchField = "Name", DefaultSearchType = "Starts With", DefaultSearchText = "v4",
        IconUrl = "octicon:tag")]
    public class QueryRepoReleases : QueryDb<GithubRelease> { }

    public class GithubRepo
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Homepage { get; set; }
        public string Language { get; set; }
        public int Watchers_Count { get; set; }
        public int Stargazes_Count { get; set; }
        public int Forks_Count { get; set; }
        public int Open_Issues_Count { get; set; }
        public int Size { get; set; }
        public string Full_Name { get; set; }
        public DateTime Created_at { get; set; }
        public DateTime? Pushed_At { get; set; }
        public DateTime? Updated_At { get; set; }

        public bool Has_issues { get; set; }
        public bool Has_Downloads { get; set; }
        public bool Has_Wiki { get; set; }
        public bool Has_Pages { get; set; }
        public bool Fork { get; set; }

        public GithubUser Owner { get; set; }
        public string Svn_Url { get; set; }
        public string Mirror_Url { get; set; }
        public string Url { get; set; }
        public string Ssh_Url { get; set; }
        public string Html_Url { get; set; }
        public string Clone_Url { get; set; }
        public string Git_Url { get; set; }
        public bool Private { get; set; }
    }

    public abstract class GithubUser
    {
        public int Id { get; set; }
        public string Login { get; set; }
        public string Avatar_Url { get; set; }
        public string Url { get; set; }
        public int? Followers { get; set; }
        public int? Following { get; set; }
        public string Type { get; set; }
        public int? Public_Gists { get; set; }
        public string Location { get; set; }
        public string Company { get; set; }
        public string Html_Url { get; set; }
        public int? Public_Repos { get; set; }
        public DateTime? Created_At { get; set; }
        public string Blog { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public bool? Hireable { get; set; }
        public string Gravatar_Id { get; set; }
        public string Bio { get; set; }
    }

    public class GithubOrg
    {
        public int Id { get; set; }
        public string Avatar_Url { get; set; }
        public string Url { get; set; }
        public string Login { get; set; }
    }

    public class GithubByUser
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public DateTime Date { get; set; }
    }

    public class GithubCommitResult
    {
        public string Sha { get; set; }
        public GithubCommit Commit { get; set; }
        public GithubUser Author { get; set; }
        public GithubUser Committer { get; set; }
    }

    public class GithubCommit
    {
        public string Id { get; set; }
        public string Message { get; set; }
        public DateTime Date { get; set; }
        public string Name { get; set; }
        public int Comment_Count { get; set; }
        public GithubByUser Committer { get; set; }
        public GithubByUser Author { get; set; }

        public bool? ShouldSerialize(string fieldName)
        {
            return fieldName != "Committer" && fieldName != "Author";
        }
    }

    public class GithubContent
    {
        [PrimaryKey]
        public string Sha { get; set; }
        public string Path { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public int Size { get; set; }
        public string Download_Url { get; set; }
    }

    public class GithubContributor
    {
        public int Id { get; set; }
        public string Login { get; set; }
        public int Contributions { get; set; }
        public string Type { get; set; }

        public string Avatar_Url { get; set; }
        public string Gravatar_Id { get; set; }
        public string Url { get; set; }
        public bool? Site_Admin { get; set; }
    }

    public class GithubSubscriber
    {
        public int Id { get; set; }
        public string Login { get; set; }
        public int Contributions { get; set; }
        public string Type { get; set; }

        public string Avatar_Url { get; set; }
        public string Gravatar_Id { get; set; }
        public string Url { get; set; }
        public bool? Site_Admin { get; set; }
    }

    public class GithubComment
    {
        public int Id { get; set; }
        public string Body { get; set; }
        public DateTime Created_At { get; set; }
        public DateTime Updated_At { get; set; }
        public GithubUser User { get; set; }
        public string Url { get; set; }
        public string Commit_Id { get; set; }

        public string Position { get; set; }
        public string Line { get; set; }
        public string Path { get; set; }
    }

    public class GithubRelease
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Tag_Name { get; set; }
        public string Target_Commitish { get; set; }
        public string Body { get; set; }

        public bool Draft { get; set; }
        public bool PreRelease { get; set; }

        public DateTime Created_At { get; set; }
        public DateTime Published_At { get; set; }
        public GithubUser Author { get; set; }
        public string Url { get; set; }
        public string Tarball_Url { get; set; }
        public string Zipball_Url { get; set; }
    }

}