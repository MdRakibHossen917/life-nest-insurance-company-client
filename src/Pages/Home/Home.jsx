import React from 'react';
import Hero from './Hero/Hero';
import LatestBlogs from './LatestBlogs/LatestBlogs';
import PopularPolicies from './PopularPolicies/PopularPolicies';
import NewsletterSubscription from './NewsletterSubscription/NewsletterSubscription';
import OurAgents from './OurAgents/OurAgents';

const Home = () => {
    return (
      <div>
        <Hero></Hero>
        <PopularPolicies></PopularPolicies>
        <LatestBlogs></LatestBlogs>
        <NewsletterSubscription></NewsletterSubscription>
        <OurAgents></OurAgents>
      </div>
    );
};

export default Home;