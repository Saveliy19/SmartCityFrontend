import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Header from './Header';
import './AboutPetitionPage.css';
import { useNavigate } from 'react-router-dom';
import likeIcon from './like.png';

function PetitionPage() {
  const [petition, setPetition] = useState(null);
  const { petitionId } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(null);
  const isModerator = localStorage.getItem('is_moderator') === 'true';
  const [comments, setComments] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [modalImageUrl, setModalImageUrl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/get_petition_data', {
          id: petitionId 
        });
        setPetition(response.data[0]);
        setComments(response.data[0].comments);
        setPhotos(response.data[0].photos); // Set photos from the response
      } catch (error) {
        console.error('Error fetching petition data:', error);
      }
    };

    const fetchLike = async () => {
      try {
        const like = await axios.post('http://127.0.0.1:8000/check_like', {
          user_token: localStorage.getItem('token'),
          petition_id: petitionId 
        });
        setIsLiked(like.data.result);
      } catch (error) {
        console.error('Error fetching like status:', error);
      }
    };

    fetchData();
    fetchLike();
  }, [petitionId]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const openModal = (imageUrl) => {
    setModalImageUrl(imageUrl);
  };

  const closeModal = () => {
    setModalImageUrl(null);
  };

  const handleLike = async () => {
    if (!localStorage.getItem('token')) {
      alert('Нужно авторизоваться в системе, чтобы поставить подпись под заявкой!');
      return;
    }
    else {
      try {
        await axios.post('http://127.0.0.1:8000/like_petition', {
          user_token: localStorage.getItem('token'),
          petition_id: petitionId
        });
        setIsLiked(!isLiked);
        const response = await axios.post('http://127.0.0.1:8000/get_petition_data', {
          id: petitionId 
        });
        setPetition(response.data[0]);
      } catch (error) {
        console.error('Error liking petition:', error);
      }
    }
  };

  if (!petition) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      {modalImageUrl && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <img src={modalImageUrl} alt="Selected" />
          </div>
        </div>
      )}
      <h2>Информация о петиции:</h2>
      <div className="petition-content">
        <p><strong>{petition.header}</strong></p>
        <p><strong>ID:</strong> {petition.id}</p>
        <p><strong>Email заявителя:</strong> {petition.petitioner_email}</p>
        <p><strong>Адрес: </strong> {petition.region}, {petition.city_name}, {petition.address}</p>
        <p><span className={petition.is_initiative ? "text-green" : "text-red"}>
          {petition.is_initiative ? "Инициатива" : "Жалоба"}</span> в категории "{petition.category}"</p>
        <p><strong>Описание:</strong> {petition.description}</p>
        <p><strong>Дата загрузки на портал:</strong> {petition.submission_time}</p>
        <p style={{ color: petition.status === 'Решено' || petition.status === 'Одобрено' ? 'green' :
                   petition.status === 'В работе' || petition.status === 'На рассмотрении' ? 'yellow' :
                   petition.status === 'Отклонено' ? 'red' : 'blue', 
                   textTransform: 'uppercase' }}>
                   {petition.status}</p>
        <p><strong>Количество подписей:</strong> {petition.likes_count}</p>
        <div className="photos-section">
          {photos.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`Photo ${index + 1}`}
              className="petition-photo"
              onClick={() => openModal(photo)}
            />
          ))}
        </div>
        <div className='button-panel'>
          <button onClick={handleGoBack}>Назад</button>
          {isModerator ? (
            <Link to={`/update-petition/${petition.id}`}>
              <button className='update-button'>Обновить статус</button>
            </Link>
          ) : (
            <div>
              {isLiked ? (
                <img
                  src={likeIcon}
                  alt="Like"
                  className="like-icon"
                  onClick={handleLike}
                />
              ) : (
                <button onClick={handleLike}>Поставить подпись</button>
              )}
            </div>
          )}
        </div>
      </div>
      <h2>Комментарии администрации</h2>
      <div className="comments-section">
        {comments.map((comment, index) => (
          <div key={index} className="comment">
            <strong><p>Комментарий</p></strong>
            <p>{comment.data}</p>
            <strong><p>Date</p></strong>
            <p>{comment.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PetitionPage;
