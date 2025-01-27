import './App.css'
import Main from './components/page/Main';
import Login from './components/page/Login';
import Signup from './components/page/Signup';
import Chat from './components/page/Chat';
import Mypage from './components/page/Mypage';
import Upload from './components/page/Upload';

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
