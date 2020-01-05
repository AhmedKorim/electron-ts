import * as React from 'react';
import {hot} from "react-hot-loader";

class App extends React.Component {
    state = {
        number: 1
    }

    componentDidMount(): void {
        console.log('hi');
    }

    render() {
        return (
            <div>
                <button
                    onClick={() => {
                        const number = this.state.number;
                        console.log(number);
                        this.setState({number: number + 1})
                    }}
                >
                    {
                        this.state.number
                    }
                    Click me over {this.state.number} as we go here w
                </button>
            </div>
        )
    }
}

export default hot(module)(App);
