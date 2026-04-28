// src/components/Common/ServiceCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './ServiceCard.css';

// Category-aware fallback images (used when a service image_url fails to load)
const CATEGORY_FALLBACKS = {
  'AC & Appliance': 'https://images.unsplash.com/photo-1614633833026-07c0500d6881?w=600',
  'Cleaning':       'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600',
  'Plumbing':       'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600',
  'Electrical':     'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600',
  'Carpentry':      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600',
  'Painting':       'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600',
  'Pest Control':   'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=600',
  'Beauty & Wellness': 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=600',
};
const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1581578731548-c64695ce6952?w=600';

const ServiceCard = ({ service }) => {
  const stars = '★'.repeat(Math.round(service.rating)) + '☆'.repeat(5 - Math.round(service.rating));

  return (
    <div className="service-card card">
      <div className="service-card__img-wrap">
        <img
          src={service.image_url || CATEGORY_FALLBACKS[service.category_name] || DEFAULT_FALLBACK}
          alt={service.name}
          className="service-card__img"
          loading="lazy"
          onError={e => {
            e.target.onerror = null;
            e.target.src = CATEGORY_FALLBACKS[service.category_name] || DEFAULT_FALLBACK;
          }}
        />
        <span className="service-card__category">{service.category_name}</span>
      </div>

      <div className="service-card__body">
        <h3 className="service-card__title">{service.name}</h3>
        <p className="service-card__desc">{service.description?.slice(0, 80)}...</p>

        <div className="service-card__meta">
          <span className="stars" title={`${service.rating} stars`}>{stars}</span>
          <span className="service-card__reviews">({service.total_reviews?.toLocaleString()})</span>
        </div>

        <div className="service-card__footer">
          <div className="service-card__price">
            <span className="price-label">Starts at</span>
            <span className="price-value">₹{Number(service.price).toLocaleString()}</span>
          </div>
          <Link to={`/services/${service.id}`} className="btn btn-primary btn-sm">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
