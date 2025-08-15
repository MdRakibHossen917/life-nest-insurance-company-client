import React from 'react';
import Hero from './Hero/Hero';
import LatestBlogs from './LatestBlogs/LatestBlogs';
import PopularPolicies from './PopularPolicies/PopularPolicies';
import NewsletterSubscription from './NewsletterSubscription/NewsletterSubscription';

const Home = () => {
    return (
      <div>
        <Hero></Hero>
        <PopularPolicies></PopularPolicies>
        <LatestBlogs></LatestBlogs>
        <NewsletterSubscription></NewsletterSubscription>
      </div>
    );
};

export default Home;