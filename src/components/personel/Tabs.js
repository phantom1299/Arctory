import React, { Component } from 'react'
import { Dimensions, TouchableOpacity, Modal } from 'react-native'
import { connect } from 'react-redux'
import { Container, Header, Tab, Tabs, Card, CardItem, Icon, View, TabHeading, Badge } from 'native-base'
import QRCodeScanner from 'react-native-qrcode-scanner'
import ProblemList from './ProblemList'
import { MyText as Text } from '../common'

const { height } = Dimensions.get('window')

class Problems extends Component {
  constructor(props) {
    super(props)

    this.state = {
      visible: false,
      title: 'Sorunlar',
      toiletId: '' // 5ad255bde2b2af0014fdcfb0
    }
  }

  componentDidMount() {
    setTimeout(this._tabs.goToPage.bind(this._tabs, 1))
  }

  onLogout = () => {
    this.props.screenProps.onLogout()
  }

  onSuccess = ({ data }) => {
    this.setState({ visible: false, toiletId: data }, this._tabs.goToPage.bind(this._tabs, 1))
  }

  onCloseModal = () => {
    this.setState({ visible: false }, this._tabs.goToPage.bind(this._tabs, 1))
  }

  onChangeTab = ({ i, from }) => {
    switch (i) {
      case 0:
        this.setState({ visible: true })
        break
      case 1:
        this.setState({ title: 'Sorunlar' })
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
        <View style={{ alignSelf: 'center', width: 120, height: 120, borderRadius: 60, backgroundColor: 'lightgreen' }} />
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 16, paddingRight: 10 }}>Kullanıcı Adı</Text>
          <Badge info>
            <Icon name="star" style={{ color: "#fff" }}/>
          </Badge>
        </View>
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

  renderModal() {
    return (
      <Modal animationType="slide" onRequestClose={this.onCloseModal} visible={this.state.visible}>
        <Container>
          <Header
            style={{
              backgroundColor: 'black',
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}
            androidStatusBarColor="black"
            hasTabs
          >
            <TouchableOpacity>
              <Icon
                style={{ color: '#fff', padding: 10 }}
                onPress={this.onCloseModal}
                ios="ios-close"
                android="md-close"
              />
            </TouchableOpacity>
          </Header>
          <QRCodeScanner
            onRead={this.onSuccess}
            top
            fadeIn={false}
            showMarker
            containerStyle={{ alignSelf: 'center' }}
            topViewStyle={{ flex: null }}
            bottomViewStyle={{ flex: null }}
            cameraStyle={{ flex: 1 }}
          />
          <Text
            style={{
              position: 'absolute',
              bottom: 0,
              alignSelf: 'center',
              color: '#fff',
              padding: 20
            }}
          >
            Tuvaletin girişindeki Karekodu okutunuz.
          </Text>
        </Container>
      </Modal>
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
          initialPage={1}
          style={{ height }}
        >
          <Tab
            heading={
              <TabHeading
                style={{
                  backgroundColor: '#fff'
                }}
              >
                <Icon style={{ color: '#000' }} name="md-qr-scanner" />
              </TabHeading>
            }
          >
            {this.renderModal()}
          </Tab>
          <Tab
            heading={
              <TabHeading
                style={{
                  backgroundColor: '#fff'
                }}
              >
                <Text style={{ textAlign: 'center' }}>Sorunlar</Text>
              </TabHeading>
            }
          >
            <ProblemList
              openQR={() =>
                this.setState({ visible: true }, this._tabs.goToPage.bind(this._tabs, 0))
              }
              tenantId={this.props.tenantId}
              toiletId={this.state.toiletId}
            />
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
