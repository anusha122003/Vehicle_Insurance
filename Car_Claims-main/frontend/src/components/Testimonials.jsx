import { motion } from 'framer-motion';
import styles from './Testimonials.module.css';

export default function Testimonials() {
  const reviews = [
    {
      quote: "AutoShield cut our average claim review from 7 days to under 10 minutes. The fraud flagging alone paid for itself in the first month.",
      author: "Rajesh M.",
      initials: "RM",
      role: "Head of Claims Operations",
      company: "VERICOVER",
      colorClass: "cyanCard"
    },
    {
      quote: "The AI-generated explanations mean our adjusters spend time on complex cases, not paperwork. It's transformed the team.",
      author: "Priya S.",
      initials: "PS",
      role: "Insurance Operations Lead",
      company: "NEXCLAIM",
      colorClass: "greenCard"
    },
    {
      quote: "We processed 400 claims in a weekend after the Chennai floods. No backlogs, no overtime. AutoShield just handled it.",
      author: "Arun K.",
      initials: "AK",
      role: "CTO",
      company: "RAPIDSETTLE",
      colorClass: "amberCard"
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <section className={styles.section} id="testimonials">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sub}>
            <span className={styles.subBrackets}>[</span>
            <span className={styles.subText}>WHAT TEAMS SAY</span>
            <span className={styles.subBrackets}>]</span>
          </span>
          <h2 className={styles.title}>Built for the Teams Who Ship Claims.</h2>
        </div>

        <motion.div 
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
        >
          {reviews.map((rev, index) => (
            <motion.div 
              key={index} 
              className={`${styles.card} ${styles[rev.colorClass]}`}
              variants={itemVariants}
              data-hover="true"
            >
              {/* Stars in Amber */}
              <div className={styles.stars}>★★★★★</div>
              
              {/* Quote Quote */}
              <blockquote className={styles.quote}>
                "{rev.quote}"
              </blockquote>

              {/* Author Meta with initials avatar */}
              <div className={styles.authorMeta}>
                <div className={styles.avatar}>
                  {rev.initials}
                </div>
                <div className={styles.metaText}>
                  <span className={styles.authorName}>{rev.author}</span>
                  <span className={styles.authorRole}>
                    {rev.role}, <span className={styles.company}>{rev.company}</span>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
