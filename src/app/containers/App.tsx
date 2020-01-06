import * as React from 'react';
import {hot} from "react-hot-loader";
import * as fs from 'fs';

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
                        console.log(fs);
                        this.setState({number: number + 1})
                    }}
                >
                    {
                        this.state.number
                    }
                    Click me over {this.state.number} as wee
                </button>
            </div>
        )
    }
}

export default hot(module)(App);
