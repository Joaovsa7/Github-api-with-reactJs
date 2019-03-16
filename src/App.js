import React, { Component } from 'react';
import * as Styles from './styles/style.scss'
import CardUser from './components/cardUser';
import Profile from './components/profile';
import { HashRouter, Route, Switch } from 'react-router-dom'
import Repos from './components/repositories';


class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: [{
        username: undefined,
        login: undefined,
        avatar_url: undefined,
        followers: undefined,
        following: undefined,
        location: undefined,
        html_url: undefined,
        id: undefined,
      }],
      msgInfo: false,
      msgBox: false,
      loading: false,
      showRep: false,
      value: ''
    }
    this.fetchData = this.fetchData.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  componentDidMount(){
    if(this.state.username === undefined) return false;
    this.fetchData();
  }
  loadingComponent(){
    this.setState({
      loading: true,
      msgBox: true,
      msgInfo: `Carregando...` 
    })
  }
  fetchData = () => {
    const controller = new AbortController();
    const signal = controller.signal
    if(this.state.value === ""){
      this.setState({msgBox: true, msgInfo: "O campo não pode estar vazio"})
      controller.abort()
      return false
    }
    const urlTofetch = `https://api.github.com/users/${this.state.value}`
    fetch(urlTofetch)
    .catch(err => {this.setState({ msgBox: true, msgInfo: `${err}`})
      return false;
    })
    .then(response => {
      if(response.status === 403){
        this.setState({msgBox: true, msgInfo: "Você realizou muitas solicitações erradas, tente novamente em alguns minutos"})
      }
      if(response.status === 404){
        this.setState({msgBox: true, msgInfo: "O Usuário não foi encontrado"})
      }
      if(response.status === 200){
        this.loadingComponent()
        setTimeout(() => {
          response.json()
          .then(response => {
              this.setState({ user:[response], showRep: true, value: '', msgBox: false})})
        }, 2000);
      }
    })
    .catch(err => {this.setState({msgBox: true, msgInfo: `${err}`})});
  }
  handleChange(event){
      this.setState({
        value: event.target.value.trim(),
        username: event.target.value.trim(),
        msgBox: false,
      })
    }

  toConcat = (cardUser) => {
    this.setState(state => ({
      user: state.user.concat([state]),
      bigThanTwo: true
  }))
}

  render() {
    
    return (
            <div className="App"> 
                  <Switch>
                      <Route exact path="/" render={() => <Profile state={this.state}  handleChange={this.handleChange} toConcat={this.toConcat}  fetchData={this.fetchData} />
                  } />
                      <Route exact path="/repos" render={() => <Repos state={this.state} name={this.state.user.name} handleChange={this.handleChange} toConcat={this.toConcat}  fetchData={this.fetchData} />
                  } />
                  </Switch>
            </div>
        );
      }
    }

  export default App;
  