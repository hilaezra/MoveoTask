import React from 'react'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import CodeEditor from '@uiw/react-textarea-code-editor';
import './CodeBlockPage.css';

const CodeBlockPage = () => {

    const navigate = useNavigate();
    const [socket, setSocket] = useState(null);
    const { blockId } = useParams();
    const [codeBlock, setCodeBlock] = useState();
    const [isMentor, setIsMentor] = useState(null);
    const [code, setCode] = useState('');
    const [result, setResult] = useState(null);

    useEffect(() => {
        // Fetch specific code block from the server after clicking on him 
        fetch(`https://moveotaskserver-production.up.railway.app/codeblockdata/${blockId}`)
          .then((res) => res.json())
          .then((data) => {
            setCodeBlock(data);
            setCode(data.code);

             // connect to socket.
             const socketConnection = io.connect("https://moveotaskserver-production.up.railway.app");
             setSocket(socketConnection);
            
 
             socketConnection.on('connect', () => {
                 // Socket is connected, emit the 'checkMentor' event
                 socketConnection.emit('checkMentor', blockId);
               });

          })
          .catch((error) => console.error('Error fetching code block:', error));

          return () => {
            console.log('Cleanup function: Component unmounted');
            if(socket)
            {
                socket.disconnect();
                setSocket(null);
            }
          };
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

    useEffect(() => {
        if(socket)
        {
            socket.on('mentorConfirmed', () => {
                console.log("mentorConfirmed");
                
                if(isMentor === null)
                    setIsMentor(true);
            });

            socket.on('studentInit', (data) => {
                console.log("studentInitConfirmed");
                if(!data.validEntry){
                    alert("Mentor is connected to other code block");
                    navigate("/");
                }else{
                    if(isMentor === null)
                        setIsMentor(false);

                    setCode(data.currentCode);
                }
            })
     
            socket.on('updateCode', (res) => {
                if(res.sender !== socket.id)
                    setCode(res.code);
            });

            socket.on('exitPage', () => {
                alert("Mentor is disconnected!");
                navigate("/");
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);
    
    const handleCodeChange = (event) => {
        const newCode = event.target.value;
        setCode(newCode);
        if (!isMentor) {
          socket.emit('codeChange', { blockId, newCode });
        }
    };

    const handleDisconnect = () => {
        if(socket)
        {
            socket.disconnect();
            setSocket(null);
        }
        navigate("/");
    }

    const closeModal = (event) => {
        setResult(null);
    };

    const handleCheckSolutionClicked = async (code) => {
        try {
            const response = await fetch(`https://moveotaskserver-production.up.railway.app/checksolution/${blockId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ code }),
            });

            const data = await response.json();
            setResult(data.result);
          } catch (error) {
            console.error('Error checking solution:', error);
          }
    }

    return (
        <div className="container">
            <div className="backBtn" onClick={() => handleDisconnect()}>←</div>
        {codeBlock ? (
            <div>
                <h1>{codeBlock.title}</h1>
                {isMentor === null ? (
                    <div className="loading">
                        <p>Loading...</p>
                    </div>
                ) : isMentor ? (
                    <div className="MentorView">
                        <h2>Mentor View (Read-only)</h2>
                        <CodeEditor
                            className="mentorCodeEditor"
                            value={code}
                            language="js"
                            rows={10}
                            cols={50}
                            padding={15}
                            data-color-mode="dark"
                            disabled
                        />
                    </div>
                ) : (
                    <div className="StudentView">
                        <h2>Student View (Editable)</h2>
                        <CodeEditor
                            className="studentCodeEditor"
                            value={code}
                            language="js"
                            onChange={handleCodeChange}
                            rows={10}
                            cols={50}
                            padding={15}
                            data-color-mode="dark"
                        />
                        <button
                            type="submit"
                            className="checkSolutionBtn"
                            onClick={() => handleCheckSolutionClicked(code)}
                        >
                            Check Solution
                        </button>

                        {result && (
                            <div className="checkSolutionModal">
                                <p className="modal-content">
                                    {result === 'Correct!' ? (
                                        <>
                                            <span style={{ fontSize: "64px" }}>🙂</span>
                                            <br />Congratulations! Your code is amazing!
                                        </>
                                    ) : (
                                        <>Incorrect solution</>
                                    )}
                                    <span className="close-button" onClick={() => closeModal()}>&times;</span>
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        ) : (
            <p>The mentor hasn't entered yet </p>
        )}
    </div>
    )
}

export default CodeBlockPage; 