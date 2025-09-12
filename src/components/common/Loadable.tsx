import { FC, Suspense } from "react";
import Loader from "./Leader";

const Loadable: <P extends object>(Component: FC<P>) => FC<P> =
  (Component) => (props) =>
    (
      <Suspense fallback={<Loader />}>
        <Component {...props} />
      </Suspense>
    );

export default Loadable;
