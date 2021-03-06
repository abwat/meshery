import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { AppBar, Paper, Tooltip } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCloud, faPoll, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import { faMendeley } from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';
import MeshConfigComponent from './MeshConfigComponent';
import GrafanaComponent from './GrafanaComponent';
import MeshAdapterConfigComponent from './MeshAdapterConfigComponent';
import PrometheusComponent from './PrometheusComponent';
import MesherySettingsPerformanceComponent from "../components/MesherySettingsPerformanceComponent";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
  },
  icon: {
    display: 'inline',
    verticalAlign: 'text-top',
    width: theme.spacing(1.75),
    marginLeft: theme.spacing(0.5),
  },
  iconText: {
    display: 'inline',
    verticalAlign: 'middle',
  },
  backToPlay: {
    margin: theme.spacing(2),
  },
  link: {
    cursor: 'pointer',
  },
});

function TabContainer(props) {
  return (
    <Typography
      component="div"
      style={{
        paddingTop: 2,
      }}
    >
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

class MesherySettings extends React.Component {
  constructor(props) {
    super(props);
    const {
      k8sconfig, meshAdapters, grafana, prometheus, router: {asPath}
    } = props;

    let tabVal = 0;
    const splittedPath = asPath.split('#');
    if(splittedPath.length >= 2 && splittedPath[1]) {
      switch (splittedPath[1]) {
        case 'environment': 
          tabVal = 0;
          break;
        case 'service-mesh': 
          tabVal = 1;
          break;
        case 'metrics': 
          tabVal = 2;
          break;
        case 3:
          newRoute+='#performance'
          break;
      }
    }
    this.state = {
      completed: {},
      k8sconfig,
      meshAdapters,
      grafana,
      prometheus,
      tabVal,
      subTabVal: 0,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (JSON.stringify(props.k8sconfig) !== JSON.stringify(state.k8sconfig)
        || JSON.stringify(props.meshAdapters) !== JSON.stringify(state.meshAdapters)) {
      return {
        k8sconfig: props.k8sconfig,
        meshAdapters: props.meshAdapters,
        grafana: props.grafana,
        prometheus: props.prometheus,
      };
    }
    return null;
  }

  handleChange(val) {
    const self = this;
    return (event, newVal) => {
      if (val === 'tabVal') {
        let newRoute = this.props.router.route;
        switch(newVal) {
          case 0:
            newRoute+='#environment'
            break;
          case 1:
            newRoute+='#service-mesh'
            break;
          case 2:
            newRoute+='#metrics'
            break;
          case 3:
            newRoute+='#performance'
            break;
        }
        if(this.props.router.route != newRoute) this.props.router.push(newRoute)
        self.setState({ tabVal: newVal });
      } else if (val === 'subTabVal') {
        self.setState({ subTabVal: newVal });
      }
    };
  }

  render() {
    const { classes } = this.props;
    const {
      tabVal, subTabVal, k8sconfig, meshAdapters,
    } = this.state;

    const mainIconScale = 'grow-10';
    let backToPlay = '';
    if (k8sconfig.clusterConfigured === true && meshAdapters.length > 0) {
      backToPlay = (
        <div className={classes.backToPlay}>
          <Link href="/management">
            <div className={classes.link}>
              <FontAwesomeIcon icon={faArrowLeft} transform="grow-4" fixedWidth />
              {' '}
              You are all set to manage service meshes
            </div>
          </Link>
        </div>
      );
    }
    return (
      <div className={classes.root}>
        <Paper square className={classes.root}>
          <Tabs
            value={tabVal}
            onChange={this.handleChange('tabVal')}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tooltip title="Identify your cluster" placement="top">
              <Tab
                icon={
                  <FontAwesomeIcon icon={faCloud} transform={mainIconScale} fixedWidth />
                }
                label="Environment"
              />
            </Tooltip>
            <Tooltip title="Connect Meshery Adapters" placement="top">
              <Tab
                icon={
                  <FontAwesomeIcon icon={faMendeley} transform={mainIconScale} fixedWidth />
                }
                label="Service Meshes"
              />
            </Tooltip>
            <Tooltip title="Configure Metrics backends" placement="top">
              <Tab
                icon={
                  <FontAwesomeIcon icon={faPoll} transform={mainIconScale} fixedWidth />
                }
                label="Metrics"
              />
            </Tooltip>
            <Tooltip title="Choose Performance Test Defaults" placement="top">
              <Tab
                icon={
                  <FontAwesomeIcon icon={faTachometerAlt} transform={mainIconScale} fixedWidth />
                }
                label="Performance"
              />
            </Tooltip>
          </Tabs>
        </Paper>
        {tabVal === 0 && (
          <TabContainer>
            <AppBar position="static" color="default">
              <Tabs
                value={subTabVal}
                onChange={this.handleChange('subTabVal')}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
              >
                <Tab label="Out of Cluster Deployment" />
                <Tab label="In Cluster Deployment" />
              </Tabs>
            </AppBar>
            {subTabVal === 0 && (
              <TabContainer>
                <MeshConfigComponent tabs={subTabVal} />
              </TabContainer>
            )}
            {subTabVal === 1 && (
              <TabContainer>
                <MeshConfigComponent tabs={subTabVal} />
              </TabContainer>
            )}
          </TabContainer>
        )}
        {tabVal === 1 && (
          <TabContainer>
            <MeshAdapterConfigComponent />
          </TabContainer>
        )}
        {tabVal === 2
        && (
          <TabContainer>
            <AppBar position="static" color="default">
              <Tabs
                value={subTabVal}
                onChange={this.handleChange('subTabVal')}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
              >
                <Tab label={(
                  <div className={classes.iconText}>
                  Grafana
                    <img src="/static/img/grafana_icon.svg" className={classes.icon} />
                  </div>
                )}
                />
                <Tab label={(
                  <div className={classes.iconText}>
                  Prometheus
                    <img src="/static/img/prometheus_logo_orange_circle.svg" className={classes.icon} />
                  </div>
                )}
                />
              </Tabs>
            </AppBar>
            {subTabVal === 0 && (
              <TabContainer>
                <GrafanaComponent />
              </TabContainer>
            )}
            {subTabVal === 1 && (
              <TabContainer>
                <PrometheusComponent />
              </TabContainer>
            )}
          </TabContainer>
        )}
        {tabVal === 3 && (
          <TabContainer>
            <MesherySettingsPerformanceComponent />

          </TabContainer>
        )}

        {backToPlay}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const k8sconfig = state.get('k8sConfig').toJS();
  const meshAdapters = state.get('meshAdapters').toJS();
  const grafana = state.get('grafana').toJS();
  const prometheus = state.get('prometheus').toJS();
  return {
    k8sconfig,
    meshAdapters,
    grafana,
    prometheus,
  };
};

MesherySettings.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(connect(mapStateToProps)(withRouter(MesherySettings)));
