const graphql = require("graphql");
const _ = require("lodash");
const Perk = require("../models/perk");
const Character = require("../models/character");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLList,
} = graphql;

const CharacterType = new GraphQLObjectType({
  name: "Character",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    role: { type: GraphQLString },
  }),
});

const PerkType = new GraphQLObjectType({
  name: "Perk",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    icon: { type: GraphQLString },
    description: { type: GraphQLString },
    keywords: { type: GraphQLString },
    character: {
      type: CharacterType,
      resolve(parent, args) {
        return Character.findById(parent.characterId);
      },
    },
  }),
});
//Our root queries, the urls basically
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    perk: {
      //Type that matches the above
      type: PerkType,
      //arguments passed in query perk(id:'123')
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //Code to get from DB or source
        return Perk.findById(args.id);
      },
    },
    character: {
      type: CharacterType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Character.findById(args.id);
      },
    },
    perks: {
      type: new GraphQLList(PerkType),
      args: { characterId: { type: GraphQLID } },
      resolve(parent, args) {
        if (args.characterId) {
          return Perk.find({ characterId: args.characterId });
        } else {
          return Perk.find({});
        }
      },
    },
    characters: {
      type: new GraphQLList(CharacterType),
      resolve(parent, args) {
        return Character.find({});
      },
    },
  },
});
//Mutations are how we manipulate/mutate/change the database the C_UD of CRUD
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addCharacter: {
      type: CharacterType,
      args: {
        name: { type: GraphQLString },
        role: { type: GraphQLString },
      },
      resolve(parent, args) {
        //Local variable to create a new model from teh db schema
        let character = new Character({
          name: args.name,
          role: args.role,
        });
        //Take the instance and save to the DB and then also send it back to graph ql
        return character.save();
      },
    },
    addPerk: {
      type: PerkType,
      args: {
        name: { type: GraphQLString },
        icon: { type: GraphQLString },
        description: { type: GraphQLString },
        keywords: { type: GraphQLString },
        characterId: { type: GraphQLID },
      },
      resolve(parent, args) {
        let perk = new Perk({
          name: args.name,
          characterId: args.characterId,
          icon: args.icon,
          keywords: args.keywords,
          description: args.description,
        });
        return perk.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
