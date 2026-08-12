"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Erin",
    text: "Being a military spouse, I have 4 moves under my belt. But when it came time to help my mother sell her house, I wasn't as certain. Christopher Ryan was wonderful, and definitely went above and beyond for us. Compared to the previous realtors we had worked with, Christopher Ryan definetly stands out, and I will recommend her every time someone is looking for a realtor.",
  },
  {
    id: 2,
    name: "Glenn",
    text: "Christopher Ryan was friendly and helpful, and made the home buying process a charm!",
  },
  {
    id: 3,
    name: "Laurie",
    text: "Christopher Ryan worked patiently with us as we searched for, and found , a great home in neighborhoods with very few listings, and at a good price as well. Then she turned around and sold our existing home in a couple of days. Great knowledge of all things real estate.",
  },
  {
    id: 4,
    name: "Josh & Meghan",
    text: "When buying your first home Christopher Ryan is the realtor best suited for the job. Christopher Ryan gets to know her clients and is able to pick out homes that will suit you best. She really knows the areas of Ottawa well and is flexible with her time in order to book viewings when it suits you best. She is knowledgeable and we were able to understand the process of buying a home with her expertise. You'd be mistaken to not use Christopher Ryan for your future home buying needs!",
  },
  {
    id: 5,
    name: "Nicole Schenk",
    text: "I've had the pleasure of working with Christopher Ryan for a few years, and I am consistently impressed by her dedication to her clients. Christopher Ryan excels in providing a seamless experience for both sellers and buyers, ensuring that every transaction is smooth and stress-free. She takes the time to listen to her clients' needs and preferences, offering personalized and reliable service that is second to none. Her extensive knowledge of the Ottawa real estate market is truly impressive, and it is clear that she is passionate about helping her clients achieve their goals. Christopher Ryan is a true professional, and I highly recommend her to anyone looking to buy or sell property in the Ottawa area.",
  },
  {
    id: 6,
    name: "Noah",
    text: "Christopher Ryan helped me buy my first home and I'm so very happy with everything she did for me! She was very helpful and patient despite me being picky and not having clear requirements and set search parameters. She made the whole looking and buying process painless and as comfortable and understandable as possible. Christopher Ryan is such a friendly and informative resource that I would recommend to anyone wanting to navigate the real estate market. I always looked forward to any house visits that Christopher Ryan seamlessly set up for me some on same day short notice!",
  },
  {
    id: 7,
    name: "Dave Graham",
    text: "Simply put Christopher Ryan is the best. Super patient, knowledgeable and proactive and always reachable for questions, showings, offers etc etc. We are very picky and didn't know if we would find the right place but Christopher Ryan hung in there for the journey with us! Thanks again Christopher Ryan for everything you've done.",
  },
  {
    id: 8,
    name: "Cathy",
    text: "Christopher Ryan went above and beyond in her work with me. I was selling a property located five hours from my current location, which had its challenges. Christopher Ryan helped me to manage the logistics of selling a property remotely. She was, at all times, friendly, informative and, above all, knowledgeable and compassionate. I highly recommend her services!",
  },
  {
    id: 9,
    name: "Kathryn Graham",
    text: "Christopher Ryan was wonderful. She kept me well informed as to what was happening in the real estate market and then found me the place I wanted to be. I'll never move again! Christopher Ryan was friendly and patient and helped me decide what I wanted in my new home Kudos Christopher Ryan!",
  },
  {
    id: 10,
    name: "Daniel P",
    text: "Christopher Ryan was amazing since the day I landed in Canada. She treated me like I was her best client since the beginning. Her good humor and patience make the process of finding a home much more enjoyable. I highly recommended her!",
  },
  {
    id: 11,
    name: "Kirby Chan",
    text: "Christopher Ryan is an amazing Realtor. She's a senior graduate of our social media program. She has all the social media tools to support buyers in finding off market homes and support sellers in promoting their homes to a wide audience!!!",
  },
  {
    id: 12,
    name: "Sandip",
    text: "This real estate agent will be there for you when you need guidance and support. She is very prompt and responsive on email and text and will call or meet you in person if that's needed. She is a very good listener and has empathy. She has lots of connections in the trades and financial industry. She really goes the extra mile and has passion for what she does. And we sold my house in a spring 2023 market for well above asking. We had a bidding war and a back up offer all which were managed with the above mentioned qualities. She cares and it shows. You need to connect with her if you are in the market.",
  },
  {
    id: 13,
    name: "Mark",
    text: "Christopher Ryan is awesome! Her help was instrumental in me being able to find the right house. Very friendly, knowledgeable and responsive!",
  },
  {
    id: 14,
    name: "Shane",
    text: "Christopher Ryan is an incredible realtor! This is the second time she's helped us with a house and I'm sure it won't be the last. She got us a good price at an uncertain time. Can't say enough good things about her!",
  },
  {
    id: 15,
    name: "Sandip",
    text: "Amazing experience! She was easily able to understand my needs. She is one of the most reliable people I have met! She was my rock during my perfect home search. Also, very knowledgeable for a home in the country. Very accommodating! I always look for an agent that is on the ball so I can get the best deal and Christopher Ryan definitely exceeded my expectations. Highly, highly recommend!",
  },
  {
    id: 16,
    name: "Karen",
    text: "Christopher Ryan was recommended to me by a friend two years ago when I arrived in Ottawa from the Niagara region. Christopher Ryan spent a lot of time with me helping me find a wonderful house to call home. Two years later and a relocation back to Niagara, Christopher Ryan was there every step of the way assisting me in providing suggestions that would allow me to sell my home quickly and for a favourable price. Christopher Ryan went over and above her responsibility as a realtor and provided tremendous support during a time that can be very stressful. I feel very lucky to have met her and would highly recommend her services",
  },
  {
    id: 17,
    name: "Soormee Robin",
    text: "I stumbled across Christopher Ryan, at the beginning of my house-search, and I now considerate it to be a divine accident. I reached out to ask a question, to which she responded effortlessly, with the ease and lightness which is customary of her style. During our time together, I came to realize that she is a person of high integrity, always taking the extra time to address things things properly and thoroughly. She always made sure that she had done everything possible to accommodate my needs throughout all the various scenarios that we went through together, and she always seemed to have something in her (very ethical) \"bag of tricks\" to make things work. I can't recommend her service highly enough, she gave me 5-star service all the way! I'm very grateful!!",
  },
  {
    id: 18,
    name: "Ann",
    text: "Hi, just a note to say thanks for all you have done for us throughout this process. As first time buyers, we had a lot of unanswered questions regarding the purchase of our home. Thank you for providing the answers to many of these and giving us informed advice on the homes that we visited!",
  },
  {
    id: 19,
    name: "Cheyenne",
    text: "Christopher Ryan was a pleasure to work with! As first time Canadian homebuyers, she made the process simple and easy. She provided great resources to help us find our ideal home. We look forward to working with her again in the future!",
  },
  {
    id: 20,
    name: "Sandy",
    text: "Christopher Ryan helped us to find our perfect home in Carleton Place, in March 2021! She was always so organized for our house tours, with: clipboards, spec sheets, and hand sanitizer! Christopher Ryan always listened to our feedback, and would use our info to update the listings she would send us! We loved working with Christopher Ryan, as I'm sure you will!",
  },
  {
    id: 21,
    name: "Spencer",
    text: "Christopher Ryan is one of the hardest working and dedicated agents I have dealt with after buying ten houses. Christopher Ryan guided us through one of the toughest transactions I have done. The result is we live in our dream forever home.",
  },
  {
    id: 22,
    name: "Ken",
    text: "Christopher Ryan goes above and beyond in everything about selling homes!",
  },
  {
    id: 23,
    name: "Suzanne",
    text: "Christopher Ryan helped me buy a home in Ottawa's Copeland Park neighbourhood in January 2021. There are very few properties on the Ottawa market and you have to move fast. Christopher Ryan gave me all the information I needed in a very short period of time and explained clearly how to proceed to make an offer. I could count on her at every step, before and after my offer was accepted. She always answered quickly all my questions. She is supportive, knowledgeable and professional. But there is more: she is also a great person. I highly recommend her services to friends and family.",
  },
  {
    id: 24,
    name: "Virginia",
    text: "What really sets Christopher Ryan apart is her heart. When our first offer didn't get accepted she followed up with us the next day with words of encouragement, and that really made us feel comforted. It's personal touches like this that really made the experience with her so great. For first time buyers the process can be really overwhelming and Christopher Ryan took the time to patiently walk us through each step, always willing to dig up the information we were looking for and making sure we were comfortable and informed every step of the way. We cannot thank her enough for her help with our new home!",
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef(null);
  const intervalRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const cardsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / cardsPerPage);

  const currentTestimonials = testimonials.slice(
    currentPage * cardsPerPage,
    currentPage * cardsPerPage + cardsPerPage
  );

  const resetAutoRotate = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 6000);
  }, [totalPages]);

  const goToPage = useCallback(
    (page) => {
      if (isAnimating) return;
      setCurrentPage(page);
      resetAutoRotate();
    },
    [isAnimating, resetAutoRotate]
  );

  const nextPage = () => goToPage((currentPage + 1) % totalPages);
  const prevPage = () => goToPage((currentPage - 1 + totalPages) % totalPages);
  const goToDot = (i) => goToPage(i);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    const timer = setTimeout(() => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) setIsVisible(true);
      }
    }, 200);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    resetAutoRotate();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isVisible, resetAutoRotate]);

  const avatarColors = [
    "linear-gradient(135deg, #208288, #0D9488)",
    "linear-gradient(135deg, #D81660, #E11D48)",
    "linear-gradient(135deg, #7C3AED, #8B5CF6)",
    "linear-gradient(135deg, #EA580C, #F97316)",
    "linear-gradient(135deg, #2563EB, #3B82F6)",
    "linear-gradient(135deg, #059669, #10B981)",
    "linear-gradient(135deg, #DC2626, #EF4444)",
    "linear-gradient(135deg, #0891B2, #06B6D4)",
  ];

  const getAvatarColor = (id) => avatarColors[(id - 1) % avatarColors.length];

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden py-16 sm:py-20 lg:py-28"
    >
      {/* ===== Background ===== */}
      <div className="absolute inset-0 z-0">
        {/* Top Gradient added here */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #0D9488 0%, #208288 25%, #F0F7F7 60%, #FAFAF7 100%)",
          }}
        />
        <div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #FFC885 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full opacity-[0.15] blur-3xl"
          style={{ background: "radial-gradient(circle, #208288 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full opacity-[0.06] blur-3xl"
          style={{ background: "radial-gradient(circle, #D81660 0%, transparent 70%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #208288 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ===== Header ===== */}
        <div
          className={`text-center mb-12 sm:mb-16 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageCircle size={18} className="text-white/80" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-medium text-white/80">
              Client Stories
            </span>
          </div>

          {/* Text color changed to white for top gradient contrast */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-white leading-tight mb-4">
            What Our Clients Say
          </h2>

          <p
            className={`text-white/80 text-sm sm:text-base md:text-lg max-w-xl mx-auto transition-all duration-700 delay-200 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Nothing means more to me than helping my clients feel supported, informed, and confident throughout their move. I'm grateful for the trust they've placed in me, and I'm proud to share a few of their experiences below.
          </p>
        </div>

        {/* ===== Cards Grid ===== */}
        <div className="relative min-h-95 sm:min-h-105">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              onAnimationStart={() => setIsAnimating(true)}
              onAnimationComplete={() => setIsAnimating(false)}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {currentTestimonials.map((t, index) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group relative flex flex-col" // Added flex flex-col
                >
                  <div
                    className="relative rounded-2xl overflow-hidden border border-[#208288]/10 bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#208288]/10 hover:border-[#208288]/20 flex flex-col flex-1" // Added flex flex-col flex-1 for equal height
                    style={{
                      boxShadow: "0 4px 24px rgba(32,130,136,0.06), 0 1px 4px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div className="relative p-6 sm:p-8 flex flex-col flex-1"> // Added flex-1
                      {/* Large decorative quote icon */}
                      <div className="absolute top-4 right-4 opacity-[0.06]">
                        <Quote size={64} className="text-[#208288]" />
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-1 mb-5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={15}
                            className="fill-[#FFC885] text-[#FFC885]"
                          />
                        ))}
                      </div>

                      {/* Quote Text */}
                      <p
                        className="text-[#1F2D3D]/70 text-sm sm:text-[15px] leading-relaxed mb-6 relative z-10"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 6,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        &ldquo;{t.text}&rdquo;
                      </p>

                      {/* Divider - mt-auto pushes it to the bottom */}
                      <div
                        className="w-full h-px mb-5 mt-auto"
                        style={{
                          background: "linear-gradient(to right, transparent, rgba(32,130,136,0.15), transparent)",
                        }}
                      />

                      {/* Author */}
                      <div className="flex items-center gap-3">
                        {/* Avatar — Initials circle */}
                        <div
                          className="relative w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-white ring-2 ring-white shadow-sm"
                          style={{
                            background: getAvatarColor(t.id),
                          }}
                        >
                          {t.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-[#1F2D3D] text-[15px] truncate">
                            {t.name}
                          </h4>
                          <p className="text-xs text-[#208288] font-medium truncate">
                            Verified Client
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom accent line on hover */}
                    <div
                      className="h-1 w-0 group-hover:w-full transition-all duration-500"
                      style={{
                        background: "linear-gradient(to right, #208288, #D81660)",
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ===== Navigation ===== */}
        <div className="flex items-center justify-center gap-4 mt-10 sm:mt-12">
          {/* Prev Button */}
          <button
            onClick={prevPage}
            disabled={isAnimating}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#208288]/15 bg-white flex items-center justify-center text-[#208288] hover:bg-[#208288] hover:text-white hover:border-[#208288] transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous testimonials"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => goToDot(i)}
                disabled={isAnimating}
                className={`transition-all duration-300 rounded-full disabled:cursor-not-allowed ${
                  i === currentPage
                    ? "w-8 h-2.5 bg-[#208288]"
                    : "w-2.5 h-2.5 bg-[#208288]/20 hover:bg-[#208288]/40"
                }`}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={nextPage}
            disabled={isAnimating}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#208288]/15 bg-white flex items-center justify-center text-[#208288] hover:bg-[#208288] hover:text-white hover:border-[#208288] transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next testimonials"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}