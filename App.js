import './App.css';
import Input from './input_range'

const App = () => {
  return (
    <div className="App" style={{marginLeft: 80, marginTop: 50}}>
      <h1>Welcome back, Chief!</h1>
      <p align="left">Please enter the desired maximum range in kilometers. <br/>
      This will be used to select the partners of our company falling in this range,
      and only display the in-range offices of the former.
      </p>
      <Input/>
    </div>
  );
}

export default App;
