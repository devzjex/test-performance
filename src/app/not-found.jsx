import './not-found.scss';
import Image from 'next/image';
import MyLink from '@/components/ui/link/MyLink';

export default function NotFound() {
  return (
    <div className="comming-soon">
      <h1 className="heading">
        <Image src={'/image/error-404.webp'} alt="icon not found" width={250} height={250} />
      </h1>
      <p className="text">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <p className="text">Please check the URL and try again, or return to the homepage to continue exploring.</p>
      <MyLink href="/" className="btn-home">
        <p className="back-home-button">Back Home</p>
      </MyLink>
    </div>
  );
}
