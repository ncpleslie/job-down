import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import firebase from "firebase/compat/app";

interface StyledFirebaseAuthProps {
  /**
   * The Firebase UI Web UI Config object.
   * See: https://github.com/firebase/firebaseui-web#configuration
   */
  uiConfig: firebaseui.auth.Config;
  /**
   * Callback that will be passed the FirebaseUi instance before it is
   * started. This allows access to certain configuration options such as
   * disableAutoSignIn().
   * @param ui
   */
  uiCallback?(ui: firebaseui.auth.AuthUI): void;
  /**
   * The Firebase App auth instance to use.
   */
  firebaseAuth: firebase.auth.Auth;
  className?: string;
}

const StyledFirebaseAuth: React.FC<StyledFirebaseAuthProps> = ({
  uiConfig,
  firebaseAuth,
  className,
  uiCallback,
}) => {
  const [userSignedIn, setUserSignedIn] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const firebaseUiWidget =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(firebaseAuth);
    if (uiConfig.signInFlow === "popup") {
      firebaseUiWidget.reset();
    }

    const unregisterAuthObserver = onAuthStateChanged(firebaseAuth, (user) => {
      if (!user && userSignedIn) {
        firebaseUiWidget.reset();
      }
      setUserSignedIn(!!user);
    });

    if (uiCallback) {
      uiCallback(firebaseUiWidget);
    }

    if (elementRef.current) {
      firebaseUiWidget.start(elementRef.current, uiConfig);
    }

    return () => {
      unregisterAuthObserver();
      firebaseUiWidget.reset();
    };
  }, [uiConfig, firebaseAuth, uiCallback, userSignedIn]);

  return <div className={className} ref={elementRef} />;
};

export default StyledFirebaseAuth;
