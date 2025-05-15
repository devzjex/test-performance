import ChangePassword from './_components/ChangePassword';

export default function ChangePasswordPage({ searchParams }) {
  return <ChangePassword token={searchParams?.token} />;
}
