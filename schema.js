const {GraphQLObjectType, GraphQLInt,GraphQLBoolean,GraphQLList,GraphQLString,GraphQLSchema} = require("graphql");
const axios = require("axios");

const LaunchType = new GraphQLObjectType({
    name:"Launch",
    fields: ()=>({
        flight_number: { type: GraphQLInt},
        mission_name: {type:GraphQLString},
        details: {type:GraphQLString},
        launch_date_local: {type:GraphQLString},
        launch_success: {type:GraphQLBoolean},
        rocket:{type: RocketType}
    })
})

const RocketType = new GraphQLObjectType({
    name:"Rocket",
    fields: ()=>({
       rocket_id: {type:GraphQLString},
       rocket_name: {type:GraphQLString},
       Rocket_type: {type:GraphQLString}
    })
})

const RootQuery = new GraphQLObjectType({
    name:"RootQueryType",
    fields:{
        launches: {
            type: new GraphQLList(LaunchType),
            async resolve(parent,args){
                const res = await axios.get("https://api.spacexdata.com/v3/launches");
                return res.data;
            }
        },
        launch:{
            type: LaunchType,
            args:{
                flight_number: {type:GraphQLInt}
            },
            async resolve(parent,args){
               const res = await axios.get(`https://api.spacexdata.com/v3/launches/${args.flight_number}`);
               return res.data;
            }
        }
        ,rockets: {
            type: new GraphQLList(RocketType),
            async resolve(parent,args){
                const res = await axios.get("https://api.spacexdata.com/v3/rockets");
                return res.data;
            }
        },
        rocket:{
            type: RocketType,
            args:{
                flight_number: {type:GraphQLInt}
            },
            async resolve(parent,args){
               const res = await axios.get(`https://api.spacexdata.com/v3/launches/${args.rocket_id}`);
               return res.data;
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})