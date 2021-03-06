import React from 'react';
import Relay from 'react-relay';
import ReactDOM from 'react-dom';
import Footer from './../Footer';
import RepInfoCluster from './../reps/RepInfoCluster';
import ReportCard from './../reps/ReportCard';
import { UserUtils } from './../../utils/Utils';


class DashboardPage extends React.Component {

  constructor(props) {
    super(props);
    let user = UserUtils.getUser();
    this.state = { user };
    props.relay.setVariables({ district: parseInt(user.district), state_long: user.state_long });
  }

  getRepInfoClusters = () => {
    let { reps } = this.props.data;
    return reps ? reps.map(rep => <RepInfoCluster {...this.props} key={`repinfocluster_${rep.bioguide_id}`} {...rep} />) : null;
  }

  getReportCards = () => {
    let { reps } = this.props.data;
    return reps ? reps.map(rep => <ReportCard {...this.props}  key={`reportcard_${rep.bioguide_id}`} {...rep} />) : null;
  }

  render() {
    let { user } = this.state;
    return (
      <div className="main-dash">
        <h2 className="page-title">Hi {user.first_name}</h2>
        <div className="tally-container">
          <h1 className="tally-score">98</h1>
        </div>
        <h3>Your Reps</h3>
        <div className="rep-info-clusters">
          {this.getRepInfoClusters()}
        </div>
        <div className="report-cards">
        <h3>Score Breakdowns</h3>
          {this.getReportCards()}
        </div>
        <Footer />
      </div>
    );
  }
}

export default Relay.createContainer(DashboardPage, {
  initialVariables: {
    district: null,
    state_long: null
  },
  fragments: {
    data: () => Relay.QL`
      fragment on Data {
        id
        reps(district: $district, state_long: $state_long) {
          address
          bio_text
          bioguide_id
          chamber
          congress_url
          district
          facebook
          leadership_position
          name
          party
          phone
          photo_url
          served_until
          state
          twitter_handle
          twitter_url
          website
          year_elected
        }
        ${ReportCard.getFragment('data')}
      }
    `
  }
});
