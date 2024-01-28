
import React,  { useState, useEffect } from 'react';
import './styles/student_page.css';


function StudentPage() {
    const [professors, setProfessors] = useState([]);
    const [formValues, setFormValues] = useState({ thesisTitle: '', description: '', supervisor: '' });

    useEffect(() => {
        // Preluarea listei de profesori
        const fetchProfessors = async () => {
            try {
                const response = await fetch('/api/professors');
                const data = await response.json();
                setProfessors(data);
            } catch (error) {
                console.error('Eroare la preluarea profesorilor:', error);
            }
        };

        fetchProfessors();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('/api/student', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formValues),
            });

            if (response.ok) {
                console.log('Cererea a fost trimisă cu succes');

            } else {
                console.error('Eroare la trimiterea cererii');

            }
        } catch (error) {
            console.error('Eroare la trimiterea cererii:', error);
        }
    };

    const handleChange = (event) => {
        setFormValues({ ...formValues, [event.target.name]: event.target.value });
    };

    return (
        <div className="student-container">
            <h1>Cerere Disertație</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="thesisTitle">Titlul Disertației:</label>
                    <input
                        type="text"
                        id="thesisTitle"
                        name="thesisTitle"
                        value={formValues.thesisTitle}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Descriere Scurtă:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formValues.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="supervisor">Profesor Coordonator:</label>
                    <select
                        id="supervisor"
                        name="supervisor"
                        onChange={handleChange}
                        value={formValues.supervisor}
                        required
                    >
                        <option value="">Selectează un profesor</option>
                        {professors.map((professor) => (
                            <option key={professor.professorId} value={professor.professorId}>
                                {professor.lastName}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Trimite Cererea</button>
            </form>
        </div>
    );
}

export default StudentPage;
