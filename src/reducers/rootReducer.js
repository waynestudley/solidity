

const initState = {
    hasPhoto: true,
    reduxTest: 'this is state stored in a redux store.',
}

const rootReducer = (state = initState, action) => {
    //console.log('Action:', action);
    //console.log('State:', state);
    return state;

}

export default rootReducer