import React, { Component } from 'react'
import { Dimensions } from 'react-native'
import { connect } from 'react-redux'
import {
  Container,
  Header,
  Tab,
  Tabs,
  Card,
  CardItem,
  Toast,
  View,
  TabHeading,
  Spinner
} from 'native-base'
import { MyText as Text } from '../common'
import { getProblemCodes } from '../../api'
import PieChartScreen from './PieChartScreen'
import BarChartScreen from './BarChartScreen'

const { height } = Dimensions.get('window')

class Problems extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loadingProblemCodes: true,
      title: 'Dağılımlar',
      problemCodes: []
    }
  }

  componentDidMount() {
    getProblemCodes(this.props.tenantId)
      .then(response => (response.ok ? response.json() : Promise.reject(response.statusText)))
      .then(result => this.setState({ loadingProblemCodes: false, problemCodes: result }))
      .catch(err => {
        this.setState({ loadingProblemCodes: false })
        Toast.show({
          text: 'Sorunları çekilirken bir hata oluştu',
          duration: 2000,
          type: 'danger',
          position: 'bottom'
        })
      })
  }

  onLogout = () => {
    this.props.screenProps.onLogout()
  }

  onChangeTab = ({ i, from }) => {
    switch (i) {
      case 0:
        this.setState({ title: 'Dağılımlar' })
        break
      case 1:
        this.setState({ title: 'Ortalama Süreler' })
        break
      case 2:
        this.setState({ title: 'Diğer' })
        break
      default:
    }
  }

  renderSettings = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Card style={{ flex: null }}>
          <CardItem button header style={{ justifyContent: 'center' }}>
            <Text>Geri Bildirim</Text>
          </CardItem>
          <CardItem onPress={this.onLogout} button header style={{ justifyContent: 'center' }}>
            <Text>Çıkış Yap</Text>
          </CardItem>
        </Card>
      </View>
    )
  }

  render = () => {
    return (
      <Container>
        <Header
          hasTabs
          style={{
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
          androidStatusBarColor="#fff"
        >
          <View>
            <Text style={{ paddingLeft: 20, color: '#333', fontWeight: 'bold', fontSize: 24 }}>
              {this.state.title}
            </Text>
          </View>
          <View />
        </Header>
        <Tabs
          ref={component => {
            this._tabs = component
          }}
          locked
          tabBarUnderlineStyle={{ backgroundColor: 'lightblue' }}
          onChangeTab={this.onChangeTab}
          tabBarBackgroundColor="#fff"
          initialPage={0}
          style={{ height }}
        >
          <Tab
            heading={
              <TabHeading
                style={{
                  backgroundColor: '#fff'
                }}
              >
                <Text style={{ textAlign: 'center' }}>Dağılımlar</Text>
              </TabHeading>
            }
          >
            {this.state.loadingProblemCodes ? (
              <Spinner />
            ) : (
              <PieChartScreen
                problemCodes={this.state.problemCodes}
                tenantId={this.props.tenantId}
              />
            )}
          </Tab>
          <Tab
            heading={
              <TabHeading
                style={{
                  backgroundColor: '#fff'
                }}
              >
                <Text style={{ textAlign: 'center' }}>Ortalama Süreler</Text>
              </TabHeading>
            }
          >
            {this.state.loadingProblemCodes ? (
              <Spinner />
            ) : (
              <BarChartScreen
                problemCodes={this.state.problemCodes}
                tenantId={this.props.tenantId}
              />
            )}
          </Tab>
          <Tab
            heading={
              <TabHeading
                style={{
                  backgroundColor: '#fff'
                }}
              >
                <Text style={{ textAlign: 'center' }}>Diğer</Text>
              </TabHeading>
            }
          >
            {this.renderSettings()}
          </Tab>
        </Tabs>
      </Container>
    )
  }
}

const mapStateToProps = ({ user: { tenantId } }) => {
  return { tenantId }
}

export default connect(mapStateToProps)(Problems)
