import React from 'react';
import Relay from 'react-relay';

class Participation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    props.relay.setVariables({ bioguide_id: props.bioguide_id, congress: "current", chamber: props.chamber });
  }

  getStyles = () => {
    let { participation } = this.props.data;
    const percentVotes = participation ? (participation.percent_votes * 100) : null;
    let color;
    let darkerColor;

    if (percentVotes < 50) {
      color = '#D95852';
      darkerColor = '#D05350';
    } else if (percentVotes > 50 && percentVotes < 75) {
      color = '#f4c542';
      darkerColor = '#D9AF3B';
    } else if (percentVotes > 75) {
      color = '#93db76';
      darkerColor = '#89CB71';
    };

    let sliderStyle = {
      background: `linear-gradient(${darkerColor}, ${color}, ${darkerColor})`,
      width: `${percentVotes}%`
    };

    return sliderStyle;
  }

  render() {
    const { participation } = this.props.data;
    const repVotes = participation ? participation.rep_votes : null;
    const totalVotes = participation ? participation.total_votes : null;

    return (
      <div className="slider-container">
        <div className="slider-labels">
          <p>Participation:</p>
          <p>{repVotes}/{totalVotes} votes</p>
        </div>
        <div className="slider-body">
          <div className="slider-bar" style={this.getStyles()}></div>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(Participation, {
  initialVariables: {
    bioguide_id: null,
    congress: null,
    chamber: null
  },
  fragments: {
    data: () => Relay.QL`
    fragment on Data {
      participation(bioguide_id: $bioguide_id, congress: $congress, chamber: $chamber) {
        bioguide_id
        percent_votes
        rep_votes
        total_votes
      }
    }
  `
  }
});
