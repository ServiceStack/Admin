using System.Collections.Generic;
using ServiceStack.DataAnnotations;
using ServiceStack.OrmLite;

namespace ServiceStack.Admin.Web
{
    [Route("/questions")]
    [AutoQueryViewer(
        Title = "Explore StackOverflow Questions", Description = "Find ServiceStack Questions on StackOverflow", 
        IconUrl = "material-icons:cast", DefaultSearchField = "Title", DefaultSearchType = "Contains", DefaultSearchText = "ServiceStack")]
    public class StackOverflowQuery : QueryDb<Question>
    {
        public int? ScoreGreaterThan { get; set; }
    }

    [Route("/questions/search")]
    public class SearchQuestions : IReturn<SearchQuestionsResponse>
    {
        public List<string> Tags { get; set; }
        public string UserId { get; set; }
    }

    [Description("Get a list of Answers for a Question")]
    [Route("/answers/{QuestionId}")]
    public class GetAnswers : IReturn<GetAnswersResponse>
    {
        public int QuestionId { get; set; }
    }

    public class StackOverflowServices : Service
    {
        public object Get(SearchQuestions request)
        {
            var query = Db.From<Question>();

            if (request.Tags != null && request.Tags.Count > 0)
            {
                query.Join<QuestionTag>((q, t) => q.QuestionId == t.QuestionId)
                    .Where<QuestionTag>(x => Sql.In(x.Tag, request.Tags));
            }

            var response = new SearchQuestionsResponse
            {
                Results = Db.Select(query)
            };

            return response;
        }

        public object Get(GetAnswers request)
        {
            return new GetAnswersResponse
            {
                Ansnwer = Db.Single<Answer>(x => x.QuestionId == request.QuestionId)
            };
        }
    }

    public class SearchQuestionsResponse
    {
        public List<Question> Results { get; set; }
    }

    public class GetAnswersResponse
    {
        public Answer Ansnwer { get; set; }
    }

    public class AnswersResponse
    {
        public List<Answer> Items { get; set; }
        public bool HasMore { get; set; }
        public int QuotaMax { get; set; }
        public int QuotaRemaining { get; set; }
    }

    public class QuestionsResponse
    {
        public List<Question> Items { get; set; }
        public bool HasMore { get; set; }
        public int QuotaMax { get; set; }
        public int QuotaRemaining { get; set; }
    }

    public class User
    {
        public int Reputation { get; set; }
        public int Userid { get; set; }
        public string UserType { get; set; }
        public int AcceptRate { get; set; }
        public string ProfileImage { get; set; }
        public string DisplayName { get; set; }
        public string Link { get; set; }
    }

    public class Question
    {
        [PrimaryKey]
        [Alias("Id")]
        public int QuestionId { get; set; }

        public string Title { get; set; }
        public int Score { get; set; }
        public int ViewCount { get; set; }
        public bool IsAnswered { get; set; }
        public int AnswerCount { get; set; }
        public string Link { get; set; }
        public string[] Tags { get; set; }
        public User Owner { get; set; }
        public int LastActivityDate { get; set; }
        public int CreationDate { get; set; }
        public int LastEditDate { get; set; }
        public int? AcceptedAnswerId { get; set; }
    }

    public class QuestionTag
    {
        [AutoIncrement]
        public int Id { get; set; }
        public int QuestionId { get; set; }
        public string Tag { get; set; }
    }

    public class Answer
    {
        [PrimaryKey]
        [Alias("Id")]
        public int AnswerId { get; set; }

        public User Owner { get; set; }
        public bool IsAccepted { get; set; }
        public int Score { get; set; }
        public int LastActivityDate { get; set; }
        public int LastEditDate { get; set; }
        public int CreationDate { get; set; }
        public int QuestionId { get; set; }
    }
}