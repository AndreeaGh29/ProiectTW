
import React, { useState, useEffect } from 'react';
import './styles/professor_page.css';

function ProfessorPage() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        // Preluarea cererilor studenților
        const fetchRequests = async () => {
            try {
                const response = await fetch('/api/firstRequest/:professorId');
                const data = await response.json();
                setRequests(data);
            } catch (error) {
                console.error('Eroare la preluarea cererilor:', error);
            }
        };

        fetchRequests();
    }, []);

    const handleAccept = async (requestId) => {
        try {
            const response = await fetch(`/api/firstRequest/:${requestId}/accept`, { method: 'POST' });
            if (response.ok) {
                setRequests(prevRequests => prevRequests.filter(request => request.id !== requestId));
            } else {
                console.error('Eroare la acceptarea cererii');
            }
        } catch (error) {
            console.error('Eroare la procesarea cererii:', error);
        }
    };

    const handleReject = async (requestId) => {
        try {
            const response = await fetch(`/api/firstRequest/:${requestId}/reject`, { method: 'POST' });
            if (response.ok) {
                setRequests(prevRequests => prevRequests.filter(request => request.id !== requestId));
            } else {
                console.error('Eroare la respingerea cererii');
            }
        } catch (error) {
            console.error('Eroare la procesarea cererii:', error);
        }
    };

    return (
        <div className="professor-container">
            <h1>Cererile Studenților</h1>
            <div className="request-list">
                {requests.map(request => (
                    <div className="request-card" key={request.id}>
                        <h2>{request.dissertationTitle}</h2>
                        <p>Student: {request.studentName}</p>
                        <p>Descriere: {request.description}</p>
                        <div className="buttons">
                            <button className="accept-button" onClick={() => handleAccept(request.id)}>Acceptă</button>
                            <button className="reject-button" onClick={() => handleReject(request.id)}>Respinge</button>
                        </div>
                    </div>
                ))}
            </div>
            <ul>
                <li>
                    <p>Titlu Disertație: Exemplu 1</p>
                    <p>Student: Student 1</p>
                    <p>Descriere: O scurtă descriere aici...</p>
                    <button className="accept-button">Acceptă</button>
                    <button className="reject-button">Respinge</button>
                </li>
            </ul>
        </div>
    );
}

export default ProfessorPage;
