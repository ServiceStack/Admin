using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using NUnit.Framework;
using ServiceStack;
using ServiceStack.Admin.WebHost;
using ServiceStack.Data;
using ServiceStack.OrmLite;
using ServiceStack.Text;

namespace Admin.Tasks
{
    [TestFixture]
    public class StackOverflowTasks
    {
        private IDbConnectionFactory dbFactory;

        [OneTimeSetUp]
        public void OneTimeSetUp()
        {
            dbFactory = new OrmLiteConnectionFactory(Config.ConnectionString, SqliteDialect.Provider);
        }

        [Test]
        public void Import_from_StackOverflow()
        {
            var client = new JsonServiceClient();
            int numberOfPages = 10;
            int pageSize = 100;
            var dbQuestions = new List<Question>();
            var dbAnswers = new List<Answer>();
            try
            {
                for (int i = 1; i < numberOfPages + 1; i++)
                {
                    //Throttle queries
                    Thread.Sleep(100);
                    var questionsResponse = client.Get("https://api.stackexchange.com/2.2/questions?page={0}&pagesize={1}&site={2}&tagged=servicestack"
                        .Fmt(i, pageSize, "stackoverflow"));

                    QuestionsResponse qResponse;
                    using (new ConfigScope())
                    {
                        var json = questionsResponse.ReadToEnd();
                        qResponse = json.FromJson<QuestionsResponse>();
                        dbQuestions.AddRange(qResponse.Items.Select(q => q.ConvertTo<Question>()));
                    }

                    var acceptedAnswers =
                        qResponse.Items
                        .Where(x => x.AcceptedAnswerId != null)
                        .Select(x => x.AcceptedAnswerId).ToList();

                    var answersResponse = client.Get("https://api.stackexchange.com/2.2/answers/{0}?sort=activity&site=stackoverflow"
                        .Fmt(acceptedAnswers.Join(";")));

                    using (new ConfigScope())
                    {
                        var json = answersResponse.ReadToEnd();
                        var aResponse = JsonSerializer.DeserializeFromString<AnswersResponse>(json);
                        dbAnswers.AddRange(aResponse.Items.Select(a => a.ConvertTo<Answer>()));
                    }
                }
            }
            catch (Exception ex)
            {
                //ignore
                ex.Message.Print();
            }

            //Filter duplicates
            dbQuestions = dbQuestions.GroupBy(q => q.QuestionId).Select(q => q.First()).ToList();
            dbAnswers = dbAnswers.GroupBy(a => a.AnswerId).Select(a => a.First()).ToList();
            var questionTags = dbQuestions.SelectMany(q =>
                q.Tags.Select(t => new QuestionTag { QuestionId = q.QuestionId, Tag = t }));

            using (var db = dbFactory.OpenDbConnection())
            {
                db.DropAndCreateTable<Question>();
                db.DropAndCreateTable<Answer>();
                db.DropAndCreateTable<QuestionTag>();

                db.InsertAll(dbQuestions);
                db.InsertAll(dbAnswers);
                db.InsertAll(questionTags);
            }
        }

        [Test]
        public void Test_Import()
        {
            using (var db = dbFactory.OpenDbConnection())
            {
                var numberOfQuestions = db.Count<Question>();
                var numberOfAnswers = db.Count<Answer>();
                Assert.That(numberOfQuestions > 0);
                Assert.That(numberOfAnswers > 0);
            }
        }
    }

    public class ConfigScope : IDisposable
    {
        private readonly WriteComplexTypeDelegate holdQsStrategy;
        private readonly JsConfigScope scope;

        public ConfigScope()
        {
            scope = JsConfig.With(
                dateHandler: DateHandler.UnixTime,
                propertyConvention: PropertyConvention.Lenient,
                emitLowercaseUnderscoreNames: true,
                emitCamelCaseNames: false);

            holdQsStrategy = QueryStringSerializer.ComplexTypeStrategy;
            QueryStringSerializer.ComplexTypeStrategy = QueryStringStrategy.FormUrlEncoded;
        }

        public void Dispose()
        {
            QueryStringSerializer.ComplexTypeStrategy = holdQsStrategy;
            scope.Dispose();
        }
    }
}
