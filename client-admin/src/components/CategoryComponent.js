import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CategoryDetail from './CategoryDetailComponent';

class Category extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      itemSelected: null,
      selectedId: null
    };
  }

  render() {
    const cates = (this.state.categories || []).map((item) => (
      <tr
        key={item._id}
        className={
          this.state.selectedId === item._id
            ? 'datatable selected'
            : 'datatable'
        }
        onClick={() => this.trItemClick(item)}
      >
        <td>{item._id}</td>
        <td>{item.name}</td>
      </tr>
    ));

    return (
      <div>
        <div className="float-left">
          <div className="text-center">CATEGORY LIST</div>
          <table className="datatable" border="1">
            <tbody>
              <tr className="datatable">
                <th>ID</th>
                <th>Name</th>
              </tr>
              {cates}
            </tbody>
          </table>
        </div>

        <div className="inline" />

        <CategoryDetail item={this.state.itemSelected} updateCategories={this.updateCategories} />
        <div className="float-clear" />
      </div>
    );
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  trItemClick(item) {
    this.setState({
      itemSelected: item,
      selectedId: item._id
    });
  }

  updateCategories = (categories) => {
    this.setState({ categories: categories || [] });
  };

  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };

    axios
      .get('/api/admin/categories', config)
      .then((res) => {
        this.setState({ categories: Array.isArray(res.data) ? res.data : [] });
      })
      .catch((err) => {
        console.error(err);
        alert('GET CATEGORY ERROR');
      });
  }
}

export default Category;
