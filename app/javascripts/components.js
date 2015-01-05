// requires event emitter, AppAction, Store

ReactElementMixin = {
  ul: React.createFactory('ul'),
  li: React.createFactory('li'),
  div: React.createFactory('div'),
  input: React.createFactory('input'),
  form: React.createFactory('form'),
  span: React.createFactory('span')
};

Item = React.createClass({
  mixins: [ReactElementMixin],
  handleCompletion: function() {
    AppAction.update(this.props.id, {completed: !this.props.completed});
  },

  handleDeletion: function() {
    AppAction.delete(this.props.id);
  },

  handleEdit: function() {
    var itemValue = this.refs.userInput.getDOMNode().innerText;
    AppAction.update(this.props.id, {value: itemValue});
  },

  render: function() {
    var klass = (this.props.completed ? 'completed' : '')

    return (
      this.li({className: 'item ' + klass}, [
        this.span({ onClick: this.handleCompletion, className: 'complete-button' },'\u2714'),
        this.div({ onBlur: this.handleEdit,
                    contentEditable: true,
                    ref: 'userInput',
                    className: 'value',
                    dangerouslySetInnerHTML: { __html: this.props.value }
                  }),
        this.span({ onClick: this.handleDeletion, className: 'delete-button' },'\u2718'),

      ])
    )
  }
});

List = React.createClass({
  mixins: [ReactElementMixin],
  getInitialState: function() {
    return { items: [] }
  },

  componentWillMount: function() {
    Store.onChangeEvent(this.handleStoreChange)
  },

  handleStoreChange: function() {
    this.setState({items: Store.getItems()})
  },

  render: function() {
    return (
      this.ul( {id: 'list'},
        this.state.items.map(function(itemData){
          return Item(itemData);
        })
      )
    )
  }
});

Create = React.createClass({
  mixins: [ReactElementMixin],
  submitHandler: function(event) {
    event.preventDefault();
    var itemValue = this.refs.userInput.getDOMNode().value;
    AppAction.create(itemValue);
  },

  render: function() {
    return (
      this.form({onSubmit: this.submitHandler}, [
        this.input({id: 'create', type: 'text', ref: 'userInput', placeholder: 'Add something to the list!'})
      ])
    )
  }
});


Page = React.createClass({
  mixins: [ReactElementMixin],
  render: function() {
    return (
      this.div(null,[ Create(), List() ])
    )
  }
});