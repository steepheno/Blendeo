import './App.css'
import Main from './page/Main';
import Login from './page/Login';
import Signup from './page/Signup';
import Chat from './page/Chat';
import Mypage from './page/Mypage';
import Upload from './page/Upload';

import { Routes, Route, BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">

        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
