import React, { Component } from 'react';
import Main from "../components/Main";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Category from "../components/Category";
import Item from "../components/Item";
import NewSuitcaseModal from "../components/NewSuitcaseModal";
import "../styles/Items.css";
import "../styles/Suitcase.css";
import gql from "graphql-tag";
import ApolloClient from 'apollo-boost';

const client = new ApolloClient();

export default class Items extends Component {
  state = {
    items: [],
    openNewSuitcaseModal: false
  };

  componentDidMount() {

    client.query({
      query: gql` 
            { 
              allItems {
                item_name,
                item_category 
              }
            }`
    }).then(result => {
      this.setState({ items: result.data.allItems });
    })
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

  render() {
    return (
      <div className="items profile-page sidebar-collapse">
        <Header
          showNewSuitcaseModal={this.showNewSuitcaseModal}
        />
        <Main>
          <div className="page-header header-filter" data-parallax="true" id="background-items"></div>
          <div className="main main-raised">
            <div className="profile-content">
              <div className="container">
                <div className="row">
                  <div className="col-md-6 col-lg-12 ml-auto mr-auto">
                    <div className="profile">

                    </div>
                  </div>
                </div>
                <div className="row text-center new-suitcase">
                  <h2 className="wanderlust text-center">You are a true EXPLORER!</h2>
                  <h3 className="text-center">Scroll down and add more items to your packing list.</h3>
                  <img className="img-fluid animals" src="/assets/img/faces/animals.png" alt="animals" />
                </div>
              </div>
            </div>


            <div className="row">
              <div className="col-12">
                <div id="items">

                  <Category>
                    <div className="title row">
                      <div>
                        <span className="badge badge-pill badge-info">Toiletries</span>
                      </div>
                      <div>
                        <button data-category="toiletries" className="all btn btn-primary btn-sm ml-3">Select all</button>
                      </div>
                    </div>
                    <div className="row cat-row" id="toiletries">
                      {this.state.items
                        .filter(item => (item.item_category === "TOILETRIES"))
                        .map(item => (
                          <Item
                            key={item.item_name}
                            itemName={item.item_name}
                            itemCategory={item.item_category}
                          />
                        ))}

                    </div>
                  </Category>

                  <Category>
                    <div className="title row">
                      <div>
                        <span className="badge badge-pill badge-info">Clothing</span>
                      </div>
                      <div>
                        <button data-category="clothing" className="all btn btn-primary btn-sm ml-3">Select all</button>
                      </div>
                    </div>
                    <div className="row cat-row" id="clothing">
                      {this.state.items
                        .filter(item => (item.item_category === "CLOTHING"))
                        .map(item => (
                          <Item
                            key={item.item_name}
                            itemName={item.item_name}
                            itemCategory={item.item_category}
                          />
                        ))}

                    </div>
                  </Category>


                  <Category>
                    <div className="title row">
                      <div>
                        <span className="badge badge-pill badge-info">Accessories</span>
                      </div>
                      <div>
                        <button data-category="accessories" className="all btn btn-primary btn-sm ml-3">Select all</button>
                      </div>
                    </div>
                    <div className="row cat-row" id="accessories">
                      {this.state.items
                        .filter(item => (item.item_category === "ACCESSORIES"))
                        .map(item => (
                          <Item
                            key={item.item_name}
                            itemName={item.item_name}
                            itemCategory={item.item_category}
                          />
                        ))}

                    </div>
                  </Category>


                  <Category>
                    <div className="title row">
                      <div>
                        <span className="badge badge-pill badge-info">Electronics</span>
                      </div>
                      <div>
                        <button data-category="electronics" className="all btn btn-primary btn-sm ml-3">Select all</button>
                      </div>
                    </div>
                    <div className="row cat-row" id="electronics">
                      {this.state.items
                        .filter(item => (item.item_category === "ELECTRONICS"))
                        .map(item => (
                          <Item
                            key={item.item_name}
                            itemName={item.item_name}
                            itemCategory={item.item_category}
                          />
                        ))}

                    </div>
                  </Category>

                </div>
              </div>

            </div>
            <div className="row">
              <div className="col-6 mx-auto my-3 text-center">
                <button id="add-items" className="btn btn-primary btn-lg">Add Selected Items To My Suitcase</button>
              </div>
            </div>
          </div>

        </Main>
        {this.renderNewSuitcaseModal()}
        <Footer />
      </div >
    )
  }
}