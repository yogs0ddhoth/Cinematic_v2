import { NexusGenObjects } from "./schema/nexus-typegen";

export const testMovie: NexusGenObjects["Movie"] = {
    id:"tt1375666",
    image:"https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_Ratio0.6837_AL_.jpg",
    title:"Inception",
    description:"(2010)",
    runtimeStr:"148 min",
    genres:"Action, Adventure, Sci-Fi",
    genreList:[
        {key:"Action", value:"Action"},
        {key:"Adventure", value:"Adventure"},
        {key:"Sci-Fi", value:"Sci-Fi"}
    ],
    contentRating:"PG-13",
    imDbRating:8.8,
    imDbRatingVotes:2325104,
    metacriticRating:74,
    plot:"A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.",
    stars:"Christopher Nolan, Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page, Ken Watanabe",
    starList:[
        {id:"tt1375666",name:"Christopher Nolan"},
        {id:"tt1375666",name:"Leonardo DiCaprio"},
        {id:"tt1375666",name:"Joseph Gordon-Levitt"},
        {id:"tt1375666",name:"Elliot Page"},
        {id:"tt1375666",name:"Ken Watanabe"}
    ]
}