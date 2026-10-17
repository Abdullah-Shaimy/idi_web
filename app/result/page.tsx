import ResultContent from '../../components/result/ResultContent';

export const metadata = {
  title: "Check Results | Institute of Da'wa Islamiyya",
  description: 'Official result checking portal for students of the Institute of Da\'wa Islamiyya.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResultPage() {
  return <ResultContent />;
}
