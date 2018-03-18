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
import './App.css'
import client from '@doubledutch/admin-client'
import List from './List'
import FirebaseConnector from '@doubledutch/firebase-connector'
import { CSVLink } from 'react-csv';
const fbc = FirebaseConnector(client, 'msnextsteps')
fbc.initializeAppWithSimpleBackend()

export default class App extends Component {
  constructor() {
    super()
    this.state = { 
      clicks: []
     }
    this.signin = fbc.signinAdmin()
      .then(user => this.user = user)
      .catch(err => console.error(err))
  }

  componentDidMount() {

    this.signin.then(() => {
        const checkRef = fbc.database.public.allRef("click")
        checkRef.on('child_added', data => {
          var obj = data.val()
          obj["clickDate"] = new Date(obj.clickUTC).toLocaleDateString()
          this.setState({ clicks: [...this.state.clicks, {...obj, key: data.key }] })
        })
    })
    .catch(err => alert(err))
  }

  render() {
    const sortedClicks = this.state.clicks.sort(sortUsers)
    return (
      <div className="App">
        <div className="topBox">
          <p className='bigBoxTitle'>{'Lead Tracker'}</p>
          <CSVLink className="csvButton" data={this.state.clicks} filename={"click-list.csv"}>Export to CSV</CSVLink>
        </div>
        <div className="topBox">
          <List
            listData = {sortedClicks}
            listName = {"Total Clicks"}
          />
        </div>
      </div>
    )
  }







  
}

function sortUsers(a,b) {
  return a.clickUTC > b.clickUTC ? -1 : 1
}
