import React from 'react';
import Hero from './Hero/Hero';
import LatestBlogs from './LatestBlogs/LatestBlogs';
import NewsletterSubscription from './NewsletterSubscription/NewsletterSubscription';
import OurAgents from './OurAgents/OurAgents';
import PopularPolicies from './PopularPolicies/PopularPolicies';
import FAQ from './FAQ/FAQ';

const Home = () => {
    return (
      <div>
        <Hero></Hero>
       <PopularPolicies></PopularPolicies>
        <LatestBlogs></LatestBlogs>
        <NewsletterSubscription></NewsletterSubscription>
        <OurAgents></OurAgents>
        <FAQ></FAQ>

      </div>
    );
};

export default Home;