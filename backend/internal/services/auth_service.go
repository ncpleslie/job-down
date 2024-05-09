package services

import (
	"context"
	"log"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
)

type AuthService struct {
	Client *auth.Client
	Log    *log.Logger
}

func NewAuthService(app *firebase.App, log *log.Logger) *AuthService {
	ctx := context.Background()
	client, err := app.Auth(ctx)
	if err != nil {
		log.Panicln("AuthService: Error getting Auth client: ", err.Error())
	}
	return &AuthService{
		Client: client,
		Log:    log,
	}
}

func (a *AuthService) GetUser(ctx context.Context, idToken string) (*auth.UserRecord, error) {
	token, err := a.Client.VerifyIDToken(ctx, idToken)
	if err != nil {
		a.Log.Println("AuthService: Error verifying ID token: ", err.Error())

		return nil, err
	}

	user, userErr := a.Client.GetUser(ctx, token.UID)
	if userErr != nil {
		a.Log.Println("AuthService: Error getting user: ", userErr.Error())

		return nil, err
	}

	return user, err
}

func SetCtxUser(ctx context.Context, user *auth.UserRecord) context.Context {
	//nolint:all // TODO: Remove this comment when the code is implemented
	ctx = context.WithValue(ctx, "user", user)

	return ctx
}

func GetCtxUser(ctx context.Context) *auth.UserRecord {
	//nolint:all // TODO: Remove this comment when the code is implemented
	user := ctx.Value("user")
	if user == nil {
		return nil
	}

	return user.(*auth.UserRecord)
}
