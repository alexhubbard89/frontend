import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID
} from 'graphql';

import {
  connectionDefinitions,
  connectionArgs,
  connectionFromPromisedArray,
  mutationWithClientMutationId,
  globalIdField,
  fromGlobalId,
  nodeDefinitions
} from 'graphql-relay';

import rp from 'request-promise';
import config from './config';

export let repType = new GraphQLObjectType({
  name: "Rep",
  fields: () => ({
    address: { type: GraphQLString, resolve: rep => rep.address },
    attendance: { type: new GraphQLList(repAttendanceType), resolve: rep => rep.attendance },
    bio_text: { type: GraphQLString, resolve: rep => rep.bio_text },
    bioguide_id: { type: GraphQLString, resolve: rep => rep.bioguide_id },
    chamber: { type: GraphQLString, resolve: rep => rep.chamber },
    congress_url: { type: GraphQLString, resolve: rep => rep.congress_url },
    district: { type: GraphQLInt, resolve: rep => rep.district },
    facebook: { type: GraphQLString, resolve: rep => rep.facebook },
    leadership_position: { type: GraphQLString, resolve: rep => rep.leadership_position },
    name: { type: GraphQLString, resolve: rep => rep.name },
    party: { type: GraphQLString, resolve: rep => rep.party },
    phone: { type: GraphQLString, resolve: rep => rep.phone },
    photo_url: { type: GraphQLString, resolve: rep => rep.photo_url },
    memberships: { type: new GraphQLList(repMembershipType), resolve: rep => rep.memberships },
    served_until: { type: GraphQLString, resolve: rep => rep.served_until },
    state: { type: GraphQLString, resolve: rep => rep.state },
    twitter_handle: { type: GraphQLString, resolve: rep => rep.twitter_handle },
    twitter_url: { type: GraphQLString, resolve: rep => rep.twitter_url },
    website: { type: GraphQLString, resolve: rep => rep.website },
    year_elected: { type: GraphQLInt, resolve: rep => rep.year_elected },
  })
});

let repMembershipType = new GraphQLObjectType({
  name: "RepMembership",
  fields: () => ({
    bioguide_id: { type: GraphQLString, resolve: rep => rep.bioguide_id },
    committee: { type: GraphQLString, resolve: rep => rep.committee },
    committee_leadership: { type: GraphQLString, resolve: rep => rep.committee_leadership },
    subcommittee: { type: GraphQLString, resolve: rep => rep.subcommittee },
  })
});

let repAttendanceType = new GraphQLObjectType({
  name: "RepAttendance",
  fields: () => ({
    days_at_work: { type: GraphQLInt, resolve: rep => rep.days_at_work },
    percent_at_work: { type: GraphQLInt, resolve: rep => rep.percent_at_work },
    total_work_days: { type: GraphQLInt, resolve: rep => rep.total_work_days},
  })
})

export let getRepMembershipSchema = () => {
  return {
    type: new GraphQLList(repMembershipType),
    args: {
      bioguide_id: { type: GraphQLString },
      chamber: { type: GraphQLString },
    },
    resolve: (__, args) => {
      let { bioguide_id, chamber } = args;
      if (!!bioguide_id && !!chamber) {
        return new Promise((resolve, reject) => {
          rp({
            method: 'POST',
            uri: `${config.backend.uri}/committee_membership`,
            body: { bioguide_id, chamber },
            json: true
          })
          .catch(error => reject(error))
          .then(memberships => resolve(memberships.results));
        });
      }
      else {
        return null;
      }
    }
  }
}

export let getRepAttendanceSchema = () => {
  return {
    type: repAttendanceType,
    args: {
      bioguide_id: { type: GraphQLString },
      chamber: { type: GraphQLString }
    },
    resolve: (__, args) => {
      let { bioguide_id, chamber } = args;
      if (!!bioguide_id && !!chamber) {
        return new Promise((resolve, reject) => {
          rp({
            method: 'POST',
            uri: `${config.backend.uri}/attendance`,
            body: { bioguide_id, chamber },
            json: true
          })
          .catch(error => reject(error))
          .then(attendance => resolve(attendance));
        });
      }
      else {
        return null;
      }
    }
  }
}

export let getRepSchema = () => {
  return {
    type: new GraphQLList(repType),
    args: {
      district: { type: GraphQLInt },
      state_long: { type: GraphQLString }
    },
    resolve: (__, args) => {
      let { district, state_long } = args;
      if (!!district && !!state_long) {
        return new Promise((resolve, reject) => {
          rp({
            method: 'POST',
            uri: `${config.backend.uri}/congress_bio`,
            body: { district, state_long },
            json: true
          })
          .catch(error => reject(error))
          .then(reps => resolve(reps.results));
        });
      }
      else {
        return null;
      }
    }
  }
}

