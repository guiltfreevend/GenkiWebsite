// Genki ROI Calculator - Research Database
// 44+ peer-reviewed studies and industry research

const researchStudies = {
  categories: [
    {
      id: 'healthcare',
      icon: '🏥',
      title: 'Healthcare Cost Savings',
      studies: [
        {
          title: 'Workplace Wellness Programs Can Generate Savings',
          source: 'Harvard School of Public Health / Health Affairs (2010)',
          finding: 'Medical costs fall by $3.27 for every $1 invested in wellness programs, plus $2.73 reduction in absenteeism costs, resulting in a combined 6:1 return on investment.',
          link: 'https://www.healthaffairs.org/doi/10.1377/hlthaff.2009.0626'
        },
        {
          title: 'Do Workplace Wellness Programs Save Employers Money?',
          source: 'RAND Corporation (2014)',
          finding: 'Disease management programs deliver $3.80 ROI per dollar while lifestyle interventions provide $0.50 ROI. Study of 600,000 employees across 7 major employers.',
          link: 'https://www.rand.org/pubs/research_briefs/RB9744.html'
        },
        {
          title: "What's the Hard Return on Employee Wellness Programs?",
          source: 'Harvard Business Review (2010)',
          finding: "Johnson & Johnson's 30-year wellness program delivered $2.71 return per dollar invested (2002-2008), saving over $250M cumulatively. Smoking rates dropped 2/3, high blood pressure reduced >50%.",
          link: 'https://hbr.org/2010/12/whats-the-hard-return-on-employee-wellness-programs'
        },
        {
          title: 'Good OSH is Good for Business',
          source: 'EU-OSHA (European Agency for Safety and Health at Work)',
          finding: 'Workplace health investments return €2.20 per €1 invested across European companies, with absenteeism reductions of 12-36% documented.',
          link: 'https://osha.europa.eu/en/themes/good-osh-is-good-for-business'
        },
        {
          title: 'Workplace Wellness Programs Study',
          source: 'American Journal of Health Promotion (2012)',
          finding: 'Meta-analysis of 42 published studies found average ROI of $3.27 saved for every $1 spent on wellness programs, with 25% reduction in sick leave and health costs.',
          link: 'https://journals.sagepub.com/doi/10.4278/ajhp.26.1.TAHP-1'
        }
      ]
    },
    {
      id: 'nutrition',
      icon: '🥗',
      title: 'Nutrition-Productivity Connection',
      studies: [
        {
          title: 'Poor Employee Health Habits Drive Lost Productivity',
          source: 'Brigham Young University + HERO + Healthways (2012)',
          finding: 'Study of 19,803 employees found unhealthy diets make workers 66% more likely to report productivity loss. Rarely eating fruits/vegetables = 93% more likely to have productivity loss. Health factors account for 77% of ALL workplace productivity loss.',
          link: 'https://www.businesswire.com/news/home/20120806006042/en/Poor-Employee-Health-Habits-Drive-Lost-Productivity-According-to-Major-New-Study-of-Nearly-20000-American-Workers'
        },
        {
          title: 'Health Habits and Productivity Loss',
          source: 'Brigham Young University Health Study (2012)',
          finding: 'Study of 19,803 employees found those who rarely eat fruits and vegetables are 93% more likely to have productivity loss. Exercise less than 3x weekly increases productivity loss risk by 50%.',
          link: 'https://news.byu.edu/news/poor-employee-health-means-slacking-job-business-losses'
        },
        {
          title: 'Poor Workplace Nutrition Hits Productivity',
          source: 'International Labour Organization (2005)',
          finding: 'Poor diet costs nations up to 20% in lost productivity. A 1% increase in caloric adequacy correlates with a 2.27% increase in labor productivity. Obesity alone accounts for 39.2 million lost workdays annually in the US.',
          link: 'https://www.ilo.org/global/about-the-ilo/newsroom/news/WCMS_005175/lang--en/index.htm'
        },
        {
          title: 'Glycemic Load Impact on Cognitive Performance',
          source: 'ScienceDirect Meta-Analysis (2022)',
          finding: 'Low-glycemic meals (healthy foods) produce significantly better episodic memory performance 120 minutes post-consumption versus high-glycemic meals (sugary snacks). Critical for knowledge workers requiring sustained focus.',
          link: 'https://www.sciencedirect.com/science/article/pii/S014976342200313X'
        },
        {
          title: 'Workplace Nutrition Interventions Systematic Review',
          source: 'BMC Public Health (2019)',
          finding: 'Systematic review of 39 controlled studies (249,175 employees) found 14 workplace nutrition/physical activity interventions showed statistically significant improvements in absenteeism (7 studies), work performance (2 studies), and workability (3 studies).',
          link: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6909496/'
        }
      ]
    },
    {
      id: 'turnover',
      icon: '🔄',
      title: 'Tech Industry Turnover Costs',
      studies: [
        {
          title: 'Employee Replacement Costs',
          source: 'SHRM (Society for Human Resource Management) (2024)',
          finding: 'Replacing a software developer costs 100-150% of annual salary for mid-level positions, 200-250% for senior roles. For a €50,000 developer, replacement costs range from €50,000-€75,000 including recruiting, onboarding, and lost productivity.',
          link: 'https://eddy.com/hr-encyclopedia/employee-replacement-costs/'
        },
        {
          title: 'The True Cost of Employee Turnover in Tech',
          source: 'Bucketlist Rewards (2024)',
          finding: 'Tech industry turnover averages 13-21% annually (higher than most sectors). Average time to full productivity: 8 months. By 2030, businesses expected to lose $430B due to low talent retention.',
          link: 'https://bucketlistrewards.com/blog/the-true-cost-of-employee-turnover-in-tech/'
        },
        {
          title: 'Developer Attrition Reduction Framework',
          source: 'Full Scale (2024)',
          finding: 'Tech industry average tenure is only 1-3 years vs 4.1 years nationally. Stack Overflow reports 23% annual turnover, with 4 out of 5 developers "unhappy or complacent." Teams with high turnover accumulate 37% more technical debt.',
          link: 'https://fullscale.io/blog/developer-attrition-reduction-framework/'
        },
        {
          title: 'Wellness Programs Decrease Employee Turnover',
          source: 'American Fidelity (2024)',
          finding: 'Companies with effective wellness programs have 9% voluntary attrition vs 15% without—a difference of 6 departures per 100-person team. For IT companies, this translates to €500,000-€900,000 in avoided replacement costs annually.',
          link: 'https://americanfidelity.com/blog/strategy/wellness-programs-decrease-turnover/'
        }
      ]
    },
    {
      id: 'engagement',
      icon: '💪',
      title: 'Employee Engagement & Retention',
      studies: [
        {
          title: 'State of the Global Workplace Report',
          source: 'Gallup (2024-2025)',
          finding: 'Low employee engagement costs the global economy $438 billion in lost productivity annually. If fully engaged, workforce could add $9.6 trillion to the economy. Manager training improves performance metrics by 20-28%.',
          link: 'https://www.gallup.com/workplace/349484/state-of-the-global-workplace.aspx'
        },
        {
          title: 'Employee Benefits and Retention',
          source: 'SHRM Employee Benefits Survey (2023)',
          finding: '92% of employees say benefits are important to their overall job satisfaction. Organizations with strong benefits programs report 56% lower turnover than those with basic offerings.',
          link: 'https://www.shrm.org/topics-tools/research/employee-benefits-survey'
        },
        {
          title: 'Tech Company Retention Statistics',
          source: 'iCIMS & Stack Overflow (2023-2024)',
          finding: 'Tech workers have 18% higher turnover than other sectors. Average time to fill tech positions: 35-41 days. 32% of IT professionals report they are "likely to change jobs in next 12 months."',
          link: 'https://bucketlistrewards.com/blog/the-true-cost-of-employee-turnover-in-tech/'
        }
      ]
    },
    {
      id: 'bulgaria',
      icon: '🇧🇬',
      title: 'Bulgarian IT Market Data',
      studies: [
        {
          title: 'Bulgaria IT Staff Augmentation Overview',
          source: 'PWRTeams (2024)',
          finding: 'Bulgaria has 100,000+ IT outsourcing professionals and 60,000+ software industry employees (BASCOM data). The sector is a top software development hub in Eastern Europe.',
          link: 'https://pwrteams.com/talent-markets/bulgaria-it-staff-augmentation'
        },
        {
          title: 'Bulgarian IT Sector Economic Impact',
          source: 'Economic.bg (2024)',
          finding: "IT sector generates €4.35 billion annually (8.5B BGN), representing ~5% of Bulgaria's GDP with 12%+ projected annual growth. Sofia accounts for 88% of Bulgaria's ICT value-added.",
          link: 'https://www.economic.bg/en/a/view/the-it-sector-in-bulgaria-who-are-the-largest-employers'
        },
        {
          title: 'Bulgarian IT Developer Salaries',
          source: 'NextJob.bg (2024)',
          finding: 'Average Bulgarian developer salaries: €36,000-40,000 (BGN 70,000-80,000) for mid-level, €46,000-72,000 for senior positions. Replacement cost per mid-level developer: €36,000-60,000.',
          link: 'https://www.nextjob.bg/bulgarian-it-developer-salaries/'
        },
        {
          title: 'Bulgaria Sick Leave Statistics',
          source: 'Euronews/Eurostat (2023)',
          finding: 'Bulgaria has the LOWEST absenteeism in EU at 2.9% vs ~10% EU average. However, when chronic conditions occur, sick leave averages 22 days vs 9.9 EU-wide—highlighting prevention opportunity.',
          link: 'https://euronews.com/next/2023/09/27/paid-leave-in-the-eu-which-countries-are-the-most-generous'
        },
        {
          title: 'Bulgarian Tax Environment for IT',
          source: 'BoundlessHQ (2024)',
          finding: 'Bulgaria offers 10% corporate and personal income tax (EU lowest), 32.7-33.4% total social security contributions. Employer pays 70% gross salary for first 3 sick days, making prevention economically advantageous.',
          link: 'https://boundlesshq.com/guides/bulgaria/taxes/'
        },
        {
          title: 'Global Sick Leave Cost Data',
          source: 'HR Courses Online (2024)',
          finding: 'Average sick days per employee: 9.9 days globally, but Bulgaria shows 22 days when chronic conditions present. Sick leave costs employers 70% of daily salary in Bulgaria during initial period.',
          link: 'https://hrcoursesonline.com/global-sick-leave-stats/'
        },
        {
          title: 'European Corporate Wellness Market',
          source: 'Coherent Market Insights (2024)',
          finding: 'Europe accounts for 27.3% of global corporate wellness market. Expected to reach $43.28B by 2032 with 6.5% CAGR. Bulgaria positioned to benefit from this growth trend.',
          link: 'https://www.coherentmarketinsights.com/market-insight/corporate-wellness-market-2062'
        },
        {
          title: "Bulgaria's Female ICT Representation",
          source: 'EU Digital Skills Data (2024)',
          finding: 'Bulgaria has 27% female ICT specialists, among the highest in Europe. Strong technical education system produces highly-skilled workforce.',
          link: 'https://pwrteams.com/talent-markets/bulgaria-it-staff-augmentation'
        },
        {
          title: 'Bulgarian IT Companies Directory',
          source: 'TechBehemoths (2025)',
          finding: 'Bulgaria IT sector employs 65,000+ full-time professionals (excluding freelancers). Major multinationals (HP, SAP, Microsoft, VMware) have operational centers in Bulgaria. Country ranks #26 in European Innovation Scoreboard 2025.',
          link: 'https://techbehemoths.com/companies/bulgaria'
        },
        {
          title: 'Bulgaria IT Outsourcing Competitiveness',
          source: 'TechBehemoths Industry Analysis (2024)',
          finding: 'Bulgaria offers one of the best price-to-quality ratios in European IT market. Combines low labor costs, high technical skills, EU membership benefits, and cultural alignment with Western Europe.',
          link: 'https://techbehemoths.com/companies/bulgaria'
        }
      ]
    },
    {
      id: 'diabetes',
      icon: '💉',
      title: 'Diabetes Prevention Economics',
      studies: [
        {
          title: 'The Diabetes Prevention Program (DPP)',
          source: 'Diabetes Care Journal (2025)',
          finding: 'Lifestyle intervention reduces diabetes incidence by 58% vs placebo (71% for adults 60+). Benefits persist: 34% reduction over 10 years, 24% over 22 years. Study tracked 3,234 participants.',
          link: 'https://diabetesjournals.org/care/article/48/7/1101/158195/The-Diabetes-Prevention-Program-and-Its-Outcomes'
        },
        {
          title: 'National DPP Cost-Effectiveness',
          source: 'NCBI/PMC Study (2025)',
          finding: 'National DPP enrollees showed $4,552 average reduction in 2-year total direct medical costs. 88% probability of cost-effectiveness. $160,000 saved per diabetes case prevented.',
          link: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3135022/'
        },
        {
          title: 'Digital Diabetes Prevention Program',
          source: 'Johns Hopkins Medicine (2024)',
          finding: 'Digital DPP participants showed $1,169 healthcare expenditure reduction in year 1, $630 reduction in year 2 per enrollee. Scalable prevention model for workplace implementation.',
          link: 'https://www.hopkinsmedicine.org/population-health/dpep/diabetes-prevention-program'
        },
        {
          title: 'Long-term DPP Outcomes',
          source: 'Diabetes Prevention Program Research Group',
          finding: '22-year follow-up shows sustained benefits of lifestyle intervention. Participants who lost just 5-7% of body weight reduced diabetes risk by 58%. Cost-effective prevention at scale.',
          link: 'https://diabetesjournals.org/care/article/48/7/1101/158195/The-Diabetes-Prevention-Program-and-Its-Outcomes'
        }
      ]
    },
    {
      id: 'obesity',
      icon: '⚖️',
      title: 'Obesity Cost Economics',
      studies: [
        {
          title: "America's Obesity Crisis: Total Economic Cost",
          source: 'Milken Institute (2023)',
          finding: 'Total obesity costs $1.72 trillion annually in US ($480.7B direct healthcare + $1.24T lost productivity). Demonstrates massive economic burden of poor workplace nutrition.',
          link: 'https://milkeninstitute.org/sites/default/files/reports-pdf/ChronicDiseases-HighRes-FINAL_0.pdf'
        },
        {
          title: 'Employer Costs of Obesity',
          source: 'Nature Journal (2024)',
          finding: 'Obesity/overweight costs employers $425.5B annually across 158M civilian US employees = $6,472/year per worker with obesity. Direct impact on workforce economics.',
          link: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11621981/'
        },
        {
          title: "Obesity and Workers' Compensation Claims",
          source: 'Duke University Medical Center (2018)',
          finding: "Employees with obesity file ~2x more workers' comp claims, with 7x higher medical costs and 11x greater indemnity costs. Lose 8.59 workdays vs 2.92 for healthy-weight employees.",
          link: 'https://www.sciencedaily.com/releases/2018/10/181030163458.htm'
        }
      ]
    },
    {
      id: 'mental',
      icon: '🧠',
      title: 'Mental Health & Wellbeing ROI',
      studies: [
        {
          title: 'Investing in Treatment for Depression and Anxiety',
          source: 'WHO/Lancet Psychiatry (2016)',
          finding: 'Every $1 invested in treating depression/anxiety returns $4 in improved health and work capacity. Depression/anxiety cost global economy $1 trillion annually through 12 billion lost working days.',
          link: 'https://www.who.int/news/item/13-04-2016-investing-in-treatment-for-depression-and-anxiety-leads-to-fourfold-return'
        },
        {
          title: 'Depression and Work Performance',
          source: 'American Psychiatric Association Foundation (2022)',
          finding: 'Employees receiving adequate depression treatment show significant work improvements. Untreated depression costs employers $44 billion annually in lost productivity in the US alone.',
          link: 'https://workplacementalhealth.org/mental-health-topics/depression'
        },
        {
          title: 'Workplace Mental Health Programs ROI',
          source: 'Deloitte Insights (2024)',
          finding: 'Comprehensive mental health programs show 4:1 ROI on average. Combines reduced absenteeism, improved productivity, and lower healthcare utilization. Critical component of holistic wellness strategy.',
          link: 'https://www.deloitte.com/us/en/insights/topics/talent/workplace-mental-health-programs-worker-productivity.html'
        }
      ]
    },
    {
      id: 'presenteeism',
      icon: '📉',
      title: 'Presenteeism vs Absenteeism Costs',
      studies: [
        {
          title: 'Illness-Related Lost Productivity',
          source: 'Integrated Benefits Institute (2019)',
          finding: 'Illness-related lost productivity costs US employers $575B annually. Presenteeism (working while sick) costs $1.5 trillion vs $150 billion for absenteeism—a 10:1 ratio.',
          link: 'https://www.td.org/magazines/td-magazine/employee-health-and-well-being-is-a-growing-company-concern'
        },
        {
          title: 'Chronic Conditions and Workplace Productivity',
          source: 'Association for Talent Development (2024)',
          finding: 'Chronic conditions cause 6.34x higher absenteeism and 2.36x higher presenteeism rates. Combined arthritis/diabetes/heart disease results in average 14.42 workdays missed annually.',
          link: 'https://www.td.org/magazines/td-magazine/employee-health-and-well-being-is-a-growing-company-concern'
        },
        {
          title: "Presenteeism's Share of Total Employer Costs",
          source: 'Health Economics Research (2024)',
          finding: 'Presenteeism accounts for 28-56% of total employer costs for type 2 diabetes, cardiovascular disease, and obesity. Hidden costs dwarf direct medical expenses.',
          link: 'https://www.myshortlister.com/insights/chronic-disease-management-at-work'
        },
        {
          title: 'Partnership to Fight Chronic Disease Projections',
          source: 'PFCD (2024)',
          finding: 'Without intervention, chronic disease costs will reach $794B annually by 2030 in US alone. Proactive workplace wellness programs essential for cost containment.',
          link: 'https://www.myshortlister.com/insights/chronic-disease-management-at-work'
        }
      ]
    },
    {
      id: 'additional',
      icon: '📚',
      title: 'Additional Supporting Research',
      studies: [
        {
          title: 'Tech Company Wellness Case Studies',
          source: 'Google & Microsoft Programs',
          finding: 'Google provides on-site fitness, healthy meals, mindfulness for 130,000+ employees. Microsoft offers $1,200-1,500 annual wellness stipends, 20 free counseling sessions for 220,000+ employees.',
          link: 'https://www.cnbc.com/2020/11/27/google-tackling-mental-health-among-staff-with-resilience-training.html'
        },
        {
          title: 'Cost-Effectiveness of Health Risk Reduction in Small Workplaces',
          source: 'NCBI/PMC (2012)',
          finding: 'Even small workplace wellness interventions show positive ROI. Lifestyle education programs cost-effective for reducing health risks across organizations of all sizes.',
          link: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3431951/'
        }
      ]
    }
  ]
};
