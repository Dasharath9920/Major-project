function reducer(state, action) {
  switch (action.type) {
    case "ADD_USER": {
      let new_users = [...state.users];
      new_users.push({
        user_name: action.user_name,
        password: action.password,
      });
      let new_user_data = [...state.user_data];
      new_user_data.push("");
      return { ...state, users: new_users, user_data: new_user_data };
    }

    case "ADD_USER_DATA": {
      let new_user_data = [...state.user_data];
      new_user_data[action.pos] = action.user_data;
      return { ...state, user_data: new_user_data };
    }

    case "DECRYPT": {
      return { ...state, decrypt: action.decrypt };
    }

    case "LOGOUT": {
      return { ...state, curr_user: -1 };
    }

    case "UPDATE_MODAL_MESSAGE": {
      return { ...state, modal_msg1: action.msg1, modal_msg2: action.msg2 };
    }

    case "UPDATE_USER": {
      return { ...state, curr_user: action.curr_user };
    }

    case "SHOW_MODAL": {
      return { ...state, show_modal: action.show_modal };
    }

    default:
      return state;
  }
}

export default reducer;
