import React from 'react';
import Relay from 'react-relay';

class Attendance extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    props.relay.setVariables({ bioguide_id: props.bioguide_id, congress: "current", chamber: props.chamber });
  }

  render() {
    let { attendance } = this.props.data;
    return (
      <p className="days-at-work">Attendance (total days at work): {attendance ? attendance.days_at_work : null} </p>
    );
  }
}

export default Relay.createContainer(Attendance, {
  initialVariables: {
    bioguide_id: null,
    congress: null,
    chamber: null
  },
  fragments: {
    data: () => Relay.QL`
    fragment on Data {
      attendance(bioguide_id: $bioguide_id, congress: $congress, chamber: $chamber) {
        days_at_work
        percent_at_work
        total_work_days
      }
    }
  `
  }
});
