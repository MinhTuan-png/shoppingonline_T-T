import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class CategoryDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtID: '',
      txtName: ''
    };
  }

  render() {
    return (
      <div className="float-right">
        <h2 className="text-center">CATEGORY DETAIL</h2>
        <form>
          <table>
            <tbody>
              <tr>
                <td>ID</td>
                <td>
                  <input type="text" value={this.state.txtID} readOnly />
                </td>
              </tr>
              <tr>
                <td>Name</td>
                <td>
                  <input
                    type="text"
                    value={this.state.txtName}
                    onChange={(e) =>
                      this.setState({ txtName: e.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <input
                    type="submit"
                    value="ADD NEW"
                    onClick={(e) => this.btnAddClick(e)}
                  />
                  &nbsp;
                  <input
                    type="submit"
                    value="UPDATE"
                    onClick={(e) => this.btnUpdateClick(e)}
                  />
                  &nbsp;
                  <input
                    type="submit"
                    value="DELETE"
                    onClick={(e) => this.btnDeleteClick(e)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.item && this.props.item !== prevProps.item) {
      this.setState({
        txtID: this.props.item._id,
        txtName: this.props.item.name
      });
    }
  }

  // ================= ADD =================
  btnAddClick(e) {
    e.preventDefault();
    const name = this.state.txtName;

    if (!name) {
      alert('Please input name');
      return;
    }

    const cate = { name };
    this.apiPostCategory(cate);
  }

  // ================= UPDATE =================
  btnUpdateClick(e) {
    e.preventDefault();
    const { txtID, txtName } = this.state;

    if (txtID && txtName) {
      const cate = { name: txtName };
      this.apiPutCategory(txtID, cate);
    } else {
      alert('Please input id and name');
    }
  }

  // ================= DELETE =================
  btnDeleteClick(e) {
    e.preventDefault();
    const id = this.state.txtID;

    if (!id) {
      alert('Please input id');
      return;
    }

    if (window.confirm('ARE YOU SURE?')) {
      this.apiDeleteCategory(id);
    }
  }

  // ================= APIs =================
  apiPostCategory(cate) {
    const config = { headers: { 'x-access-token': this.context.token } };

    axios
      .post('/api/admin/categories', cate, config)
      .then(() => {
        alert('OK BABY!');
        this.setState({ txtID: '', txtName: '' });
        this.apiGetCategories();
      })
      .catch((err) => {
        console.error(err);
        alert('POST ERROR');
      });
  }

  apiPutCategory(id, cate) {
    const config = { headers: { 'x-access-token': this.context.token } };

    axios
      .put('/api/admin/categories/' + id, cate, config)
      .then((res) => {
        if (res.data) {
          alert('OK BABY!');
          this.apiGetCategories();
        } else {
          alert('SORRY BABY!');
        }
      })
      .catch((err) => {
        console.error(err);
        alert('PUT ERROR');
      });
  }

  apiDeleteCategory(id) {
    const config = { headers: { 'x-access-token': this.context.token } };

    axios
      .delete('/api/admin/categories/' + id, config)
      .then((res) => {
        if (res.data) {
          alert('OK BABY!');
          this.setState({ txtID: '', txtName: '' });
          this.apiGetCategories();
        } else {
          alert('SORRY BABY!');
        }
      })
      .catch((err) => {
        console.error(err);
        alert('DELETE ERROR');
      });
  }

  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };

    axios
      .get('/api/admin/categories', config)
      .then((res) => {
        // backend trả về MẢNG → truyền thẳng lên cha
        this.props.updateCategories(res.data);
      })
      .catch((err) => {
        console.error(err);
        alert('GET ERROR');
      });
  }
}

export default CategoryDetail;
