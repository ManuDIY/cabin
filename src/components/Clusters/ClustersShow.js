/*
  Copyright 2015 Skippbox, Ltd

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
import { PropTypes } from 'react';
import EntitiesList from 'components/EntitiesList';
import EntitiesRoutes from 'routes/EntitiesRoutes';
import PodsActions from 'actions/PodsActions';
import NodesActions from 'actions/NodesActions';
import ServicesActions from 'actions/ServicesActions';
import ReplicationsActions from 'actions/ReplicationsActions';
import AltContainer from 'alt-container';
import Colors from 'styles/Colors';
import SegmentedTabs from 'components/commons/SegmentedTabs';
import NamespacePicker from 'components/commons/NamespacePicker';

const {
  View,
  Animated,
  StyleSheet,
} = ReactNative;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    borderColor: Colors.BORDER,
    borderBottomWidth: 1,
  },
  clusterStatus: {
    width: 40, height: 40,
    backgroundColor: Colors.GREEN,
  },
});

export default class ClusterShow extends Component {

  static propTypes = {
    cluster: PropTypes.instanceOf(Immutable.Map).isRequired,
  }

  constructor() {
    super();
    this.state = {
      animatedIndex: new Animated.Value(0),
      activePage: 0,
    };
    this.controls = alt.stores.SettingsStore.getEntitiesToDisplay();
  }

  render() {
    const { cluster } = this.props;
    const active = this.controls.get(this.state.activePage).toLowerCase();
    return (
      <View style={styles.flex}>
        <View style={styles.header}>
          <NamespacePicker cluster={cluster}/>
          <SegmentedTabs
            isScrollable={true}
            selectedIndex={this.state.animatedIndex}
            controls={this.controls.toJS()}
            onPress={(i) => {
              Animated.timing(this.state.animatedIndex, {toValue: i, duration: 300}).start();
              this.setState({activePage: i});
            }}
          />
        </View>
        {active === 'pods' && <AltContainer stores={{
          entities: () => {
            return {
              store: alt.stores.PodsStore,
              value: alt.stores.PodsStore.getPods(cluster),
            };
          },
          status: () => {
            return {
              store: alt.stores.PodsStore,
              value: alt.stores.PodsStore.getStatus(cluster),
            };
          }}}>
          <EntitiesList
            navigator={this.props.navigator}
            listHeader="Pods"
            status={alt.stores.PodsStore.getStatus(cluster)}
            entities={alt.stores.PodsStore.getPods(cluster)}
            onPress={pod => this.props.navigator.push(EntitiesRoutes.getPodsShowRoute({pod, cluster}))}
            onRefresh={() => PodsActions.fetchPods(cluster)}
            onDelete={pod => PodsActions.deletePod({cluster, pod})}
          />
        </AltContainer>}

        {active === 'services' && <AltContainer stores={{
          entities: () => {
            return {
              store: alt.stores.ServicesStore,
              value: alt.stores.ServicesStore.getServices(cluster),
            };
          },
          status: () => {
            return {
              store: alt.stores.ServicesStore,
              value: alt.stores.ServicesStore.getStatus(cluster),
            };
          }}}>
          <EntitiesList
            navigator={this.props.navigator}
            listHeader="Services"
            status={alt.stores.ServicesStore.getStatus(cluster)}
            entities={alt.stores.ServicesStore.getServices(cluster)}
            onPress={(service) => this.props.navigator.push(EntitiesRoutes.getServicesShowRoute(service))}
            onRefresh={() => ServicesActions.fetchServices(cluster)}
          />
        </AltContainer>}

        {active === 'replications' && <AltContainer stores={{
          entities: () => {
            return {
              store: alt.stores.ReplicationsStore,
              value: alt.stores.ReplicationsStore.getReplications(cluster),
            };
          },
          status: () => {
            return {
              store: alt.stores.ReplicationsStore,
              value: alt.stores.ReplicationsStore.getStatus(cluster),
            };
          }}}>
          <EntitiesList
            navigator={this.props.navigator}
            listHeader="Replication Controllers"
            status={alt.stores.ReplicationsStore.getStatus(cluster)}
            entities={alt.stores.ReplicationsStore.getReplications(cluster)}
            onPress={(service) => this.props.navigator.push(EntitiesRoutes.getReplicationsShowRoute(service))}
            onRefresh={() => ReplicationsActions.fetchReplications(cluster)}
          />
        </AltContainer>}

        {active === 'nodes' && <AltContainer stores={{
          entities: () => {
            return {
              store: alt.stores.NodesStore,
              value: alt.stores.NodesStore.getNodes(cluster),
            };
          },
          status: () => {
            return {
              store: alt.stores.NodesStore,
              value: alt.stores.NodesStore.getStatus(cluster),
            };
          }}}>
          <EntitiesList
            navigator={this.props.navigator}
            listHeader="Nodes"
            status={alt.stores.NodesStore.getStatus(cluster)}
            entities={alt.stores.NodesStore.getNodes(cluster)}
            onPress={node => this.props.navigator.push(EntitiesRoutes.getNodesShowRoute({node, cluster}))}
            onRefresh={() => NodesActions.fetchNodes(cluster)}
            onDelete={node => NodesActions.deleteNode({cluster, node})}
          />
        </AltContainer>}
      </View>
    );
  }

}