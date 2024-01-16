import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './LobbyPage.css';

const LobbyPage = () => {

    const navigate = useNavigate();
    const [codeBlocks, setCodeBlocks] = useState([]);

    useEffect(() => {
        fetch('https://moveotaskserver-production.up.railway.app/codeblocks')
          .then((res) => res.json())
          .then((data) => setCodeBlocks(data));
      }, []);


    const handleCodeBlockClicked = (blockId) => {   
        console.log(blockId);
        navigate(`/codeBlock/${blockId}`);
    }

    return(
        <div className="container">
            <h1>Choose code block</h1>
            <ul>
                {codeBlocks.map((block) => (
                    <li key={block._id}>
                        <button className="block-code-1" type="submit" onClick={() => handleCodeBlockClicked(block._id)}>
                            {block.title}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );

}

export default LobbyPage
