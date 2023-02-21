//  initial State 

const initialState = {
    scores: [
        {
            id: Math.random().toString(16).slice(2),
            totalScore: 0,
        }
    ]

}


// select dom elements -

const allMatches = document.getElementById('all-matches');
const addMatch = document.getElementById('add-match');
const resetScore = document.getElementById('reset-score');


// html Template for mathces, 

const get_match_html_template_with_id = (id,i) =>
    `
<div class="match">
<div class="wrapper">
    <button class="lws-delete" onclick="removecounter(this)">
        <img src="./image/delete.svg" alt="" />
    </button>
    <h3 class="lws-matchName">Match ${i+1}</h3>
</div>
<div class="inc-dec">
    <form class="incrementForm" id="increment-match-score-${id}">
        <h4>Increment</h4>
        <input
            type="number"
            name="increment"
            class="lws-increment"
        />
    </form>
    <form class="decrementForm" id="decrement-match-score-${id}">
        <h4>Decrement</h4>
        <input
            type="number"
            name="decrement"
            class="lws-decrement"
        />
    </form>
</div>
<div class="numbers">
    <h2 class="lws-singleResult" id="score-${id}">0</h2>
</div>
</div>

`


// action identifiers - 

const INCREMENT = "increment";
const DECREMENT = "decrement";
const ADD_MATCH = "addMatch";
const RESET_SCORE = "resetScore";

// action creators -

// add match -

const addNewMatch = (match) => {
    return {
        type: ADD_MATCH,
        payload: match
    }
}


// increment score - 

const incrementScore = (match) => {
    return {
        type: INCREMENT,
        payload: match
    }
}


// decrement score - 

const decrementScore = (match) => {
    return {
        type: DECREMENT,
        payload: match
    }
}

// reset score - 

const resetAllScore = () => {
    return {
        type: RESET_SCORE
    }
}


// create reducer function - 

function scoreBoardReducer(state = initialState, action) {

    // add match
    if (action.type === ADD_MATCH) {
        return {
            ...state,
            scores: [
                ...state.scores,
                {
                    id: action.payload.id,
                    totalScore: action.payload.totalScore,
                }
            ]
        }

        // increment
    } else if (action.type === INCREMENT) {
        state.scores.map(dt => {
            if (dt.id == action.payload.id) {
                dt.totalScore += Number(action.payload.incrementStoreVal)
            }
        })
        return state;
    }

    // decrement
    else if (action.type === DECREMENT) {
        state.scores.map(dt => {
            if (dt.id == action.payload.id) {
                dt.totalScore -= Number(action.payload.incrementStoreVal)
                if( dt.totalScore<=0 ){
                    dt.totalScore =0
                }
            }
        })
        return state;
    }

    // reset TotalScore - 
    else if (action.type === RESET_SCORE) {
        return {
            ...state,
            scores: state.scores.map((dt) => ({
                ...dt,
                totalScore: 0
            }))
        }
    }

    // default values - 

    else {
        return state;
    }
}


// create store 

const store = Redux.createStore(scoreBoardReducer);

const render = () => {
    const state = store.getState();
    console.log(state);
    state.scores.forEach((dt, i) => {
        // console.log(dt,i+1);
        if (!document.getElementById(`${dt}-div-${dt?.id}-{i}`)) {

            const el = document.createElement("div")
            el.setAttribute("id", `${dt}-div-${dt.id}-{i}`)
            el.innerHTML = get_match_html_template_with_id(`${i}-${dt.id}`,i)
            allMatches.insertAdjacentElement("beforeend", el)

        }


        //  increment - 
        const incrementEl = document.getElementById(
            `increment-match-score-${i}-${dt.id}`
        )

        incrementEl.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                store.dispatch(incrementScore({
                    id: dt?.id,
                    incrementStoreVal: e.target.value
                }))
                e.target.value = ""

            }
        })


        //   decrement - 
        const decrementEl = document.getElementById(
            `decrement-match-score-${i}-${dt.id}`
        )

        decrementEl.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                store.dispatch(decrementScore({
                    id: dt?.id,
                    incrementStoreVal: e.target.value
                }))
                e.target.value = ""

            }
        })
        const totalScoreVal = document.getElementById(
            `score-${i}-${dt.id}`
        )
        totalScoreVal.innerHTML = dt.totalScore

    })

}
render();

// add new match - 
addMatch.addEventListener('click', () => {
    store.dispatch(
        addNewMatch({
            id:Math.random().toString(16).slice(2),
            totalScore: 0
        })
    )
})


// reset values - 

resetScore.addEventListener('click', () => {
    store.dispatch(
        resetAllScore()
    )
})

// remove element 
function removecounter(e) {
    e.parentNode.parentNode.style.display="none"
}

// subscribe 
store.subscribe(render)
