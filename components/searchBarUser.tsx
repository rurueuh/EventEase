import React, { useState, useEffect } from 'react';
import { Input, Card, Spacer, CardBody } from '@nextui-org/react';
import { db } from '@/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

interface User {
  id: string;
  username: string;
}

const UserSearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSearch = async (term: string) => {
    if (term.trim() === '') {
      setUsers([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '>=', term), where('username', '<=', term + '\uf8ff'), limit(5));

      const querySnapshot = await getDocs(q);
      const results: User[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        results.push({
          id: doc.id,
          username: data.username,
        });
      });

      setUsers(results);
    } catch (err) {
      console.error('Erreur lors de la recherche des utilisateurs:', err);
      setError('Une erreur est survenue lors de la recherche.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <div className="spinner"></div>
          <style jsx>{`
            .spinner {
              border: 4px solid rgba(0, 0, 0, 0.1);
              width: 36px;
              height: 36px;
              border-radius: 50%;
              border-left-color: #000;
              animation: spin 1s linear infinite;
            }

            @keyframes spin {
              to {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </div>
      )}

      {error && (
        <p style={{ color: 'red', marginTop: '1rem' }}>
          {error}
        </p>
      )}

      {!loading && users.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          {users.map((user) => (
            <Card key={user.id} isPressable style={{ marginBottom: '0.5rem' }}>
              <CardBody>
                <h4>{user.username}</h4>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {!loading && searchTerm.trim() !== '' && users.length === 0 && !error && (
        <p style={{ marginTop: '1rem' }}>Aucun utilisateur trouvé.</p>
      )}
    </div>
  );
};

export default UserSearchBar;
