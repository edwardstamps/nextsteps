/*
 * Copyright 2018 DoubleDutch, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { Component } from 'react'
import ReactNative, {
  Platform, Text, TextInput, View, ScrollView, StyleSheet, Alert
} from 'react-native'
import client, { TitleBar } from '@doubledutch/rn-client'
import Offers from './Offers'
import FirebaseConnector from '@doubledutch/firebase-connector'
const fbc = FirebaseConnector(client, 'msoffers')
fbc.initializeAppWithSimpleBackend()

export default class HomeView extends Component {
  constructor() {
    super()
    this.state = {
      componentConfigs : []
    }
    this.signin = fbc.signin()
    .then(user => this.user = user)
    
    this.signin.catch(err => console.error(err))
  }

  componentDidMount() {
    const componentConfigs = [
      {"type":"Offer","image1":"https://content.doubledutch.me/hubfs/AppOffer2.jpg","title1":"Simple, Scalable, and Secure Mobile Event Apps.","des1":"Whether you run internal trainings, leadership summits, incentive trips, or large user conferences, DoubleDutch’s Event App Platform scales with your event program.\n\n A dedicated Customer Success Manager and 24/7 support resources mean you’re not left on your own to execute.\n\n Let’s partner together to make your event programs a success!"},
      {"type":"Offer","image1":"https://content.doubledutch.me/hubfs/RegOffer2.jpg","title1":"Unlimited Registration, One Flat Fee","des1":"DoubleDutch Registration is built for high-volume event programs that require customized and fully-branded experiences.\n\n Our simple drag-and-drop website builder allows you to quickly create registration pages without the need for a developer.\n\n Not only is the product easy to use, DoubleDutch offers unlimited events and unlimited registrants for one flat fee."}
    ]

    this.signin.then(() => {
      this.setState({componentConfigs})
    })
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <TitleBar title="Offers" client={client} signin={this.signin} />
        <ScrollView style={styles.container}>
          { this.state.componentConfigs.map(this.getComponent) }
        </ScrollView>
      </View>
    )
  }

  getComponent = (details, i) => {
    switch(details.type) {
      case "Offer" :
        return(
          <Offers {...details} key={i} sendData={this.sendData}/>
        )
    }
  }

  sendData = (title)=> {
    fbc.database.private.adminableUserRef("click").push({
      offer: title,
      firstName: client.currentUser.firstName || null,
      lastName: client.currentUser.lastName || null,
      email: client.currentUser.email || null,
      company: client.currentUser.company || null,
      title: client.currentUser.title || null,
      phone: client.currentUser.phone || null,
      clickTime: new Date().toString()
    }).catch(error => {Alert.alert("Please try reloading page to connect to the database")})
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#E8E8E8'
  }
})
