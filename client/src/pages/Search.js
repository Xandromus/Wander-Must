import React, { Component } from 'react';
import Main from "../components/Main";
import Header from "../components/Header";
import Footer from "../components/Footer";
import QuickViewModal from '../components/QuickViewModal';
import NewSuitcaseModal from "../components/NewSuitcaseModal";
import Yelp from "../utils/Yelp";
import SearchSuitcaseCard from "../components/SearchSuitcaseCard";
import "../styles/Search.css";
import gql from "graphql-tag";
import ApolloClient from 'apollo-boost';

const GET_SUITCASES_BY_LOCALE_QUERY = gql`
query getSuitcasesByLocale( $locale_city: String! ){
  getSuitcasesByLocale(locale_city: $locale_city) {
    id
    start_date
    end_date
    travel_category
    Locale {
      id
      locale_city
      locale_admin
      locale_country
    }
    User {
      id
      username
      gender
    }
    Items {
      id
      item_name
      item_category
    }
  }
}`;

const ADD_ITEM_TO_SUITCASE_MUTATION = gql`
mutation addItemToSuitcase( $id: ID, $item_ids: [ID] ) {
  addItemToSuitcase (id: $id, item_ids: $item_ids) {
      id
      Items {
        id
    }
  }
}`;

const client = new ApolloClient();

let cityNoUnderscores = "";

export default class Search extends Component {
  state = {
    suitcaseData: [
      {
        travel_category: "",
        Locale: {
          id: "",
          locale_city: "",
          locale_admin: "",
          locale_country: ""
        },
        User: {
          id: "",
          username: "",
          gender: ""
        }
      }
    ],
    city: this.props.match.params.city,
    openQuickViewModal: false,
    openNewSuitcaseModal: false,
    rendered: false,
    index: 0,
    itemsToAdd: [],
    suitcaseId: localStorage.getItem("suitcase_id"),
    loggedInUserIdNumber: localStorage.getItem("logged_in_user_id")
  }

  componentDidMount() {

    client.query({
      query: GET_SUITCASES_BY_LOCALE_QUERY,
      variables: { locale_city: this.state.city }
    }).then(result => {
      this.setState({ suitcaseData: result.data.getSuitcasesByLocale, rendered: true });
      console.log(this.state.suitcaseData)
    })

  }

  renderCityWithoutUnderscores = () => {
    if (this.state.rendered) {
      cityNoUnderscores = this.state.suitcaseData[0].Locale.locale_city.replace(/_/g, ' ');
      return (
        cityNoUnderscores
      )
    }
  }

  showQuickViewModal = () => {
    this.setState({ openQuickViewModal: true });
  }

  resetQuickViewModal = () => {
    this.setState({ openQuickViewModal: false });
  }

  renderQuickViewModal = () => {
    if (this.state.openQuickViewModal) {
      return <QuickViewModal
        quickViewData={this.state.suitcaseData[this.state.index]}
        resetQuickViewModal={this.resetQuickViewModal}
        itemsToAdd={this.state.itemsToAdd}
        onCheckboxBtnClick={this.onCheckboxBtnClick}
        addItemsToSuitcase={this.addItemsToSuitcase}
      />
    }
  }

  setQuickViewModalIndex = (idx) => {
    this.setState({ index: idx })
  }

  showNewSuitcaseModal = () => {
    this.setState({ openNewSuitcaseModal: true });
  }

  resetNewSuitcaseModal = () => {
    this.setState({ openNewSuitcaseModal: false });
  }

  renderNewSuitcaseModal = () => {
    if (this.state.openNewSuitcaseModal) {
      return <NewSuitcaseModal
        resetNewSuitcaseModal={this.resetNewSuitcaseModal}
      />
    }
  }

  onCheckboxBtnClick = (selected) => {
    const index = this.state.itemsToAdd.indexOf(selected);
    if (index < 0) {
      this.state.itemsToAdd.push(selected);
    } else {
      this.state.itemsToAdd.splice(index, 1);
    }
    this.setState({ itemsToAdd: [...this.state.itemsToAdd] });
  }

  addItemsToSuitcase = () => {
    client.mutate({
      mutation: ADD_ITEM_TO_SUITCASE_MUTATION,
      variables: { id: this.state.suitcaseId, item_ids: this.state.itemsToAdd }
    }).then(result => {
      console.log(result);
    }).catch(err => console.log(err))
  }

  renderYelp = () => {
    if (this.state.rendered) {
      return (
        <div className="yelp-wrapper">
          <Yelp
            city={this.state.suitcaseData[0].Locale.locale_city}
            admin={this.state.suitcaseData[0].Locale.locale_admin}
            country={this.state.suitcaseData[0].Locale.locale_country}
          />
        </div>
      )
    }
  }

  render() {
    return (
      <div className="search profile-page sidebar-collapse">
        <Header
          showNewSuitcaseModal={this.showNewSuitcaseModal}
        />
        <Main>
          <div className="page-header header-filter" data-parallax="true" id="background-search"></div>
          <div className="main main-raised">
            <div className="profile-content">
              <div className="container">
                <div className="row">
                  <div className="col-md-6 col-lg-12 ml-auto mr-auto">
                    <div className="profile">

                      <div className="city-name">
                        <p>Here are some suitcases for
                <span className="locale-city"> {this.renderCityWithoutUnderscores()}</span>. Click on a suitcase and start adding items to yours!</p>

                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  {this.state.suitcaseData
                    .filter(suitcase => (suitcase.User.id !== this.state.loggedInUserIdNumber))
                    .map((suitcase, i) => (
                      <SearchSuitcaseCard
                        key={i}
                        idx={i}
                        id={suitcase.id}
                        city={suitcase.Locale.locale_city}
                        localeAdmin={suitcase.Locale.locale_admin}
                        country={suitcase.Locale.locale_country}
                        src={suitcase.Locale.locale_image}
                        startDate={suitcase.start_date}
                        endDate={suitcase.end_date}
                        category={suitcase.travel_category}
                        userName={suitcase.User.username}
                        gender={suitcase.User.gender}
                        rendered={this.state.rendered}
                        showQuickViewModal={this.showQuickViewModal}
                        setQuickViewModalIndex={this.setQuickViewModalIndex}
                      />
                    ))}
                </div>
              </div>
            </div>
            {this.renderYelp()}
          </div>
        </Main>
        {this.renderQuickViewModal()}
        {this.renderNewSuitcaseModal()}
        <Footer />

      </div>
    )
  }
}
