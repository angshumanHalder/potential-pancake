package services

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type UserSchema struct {
	Verified bool `bson:"verified"`
}

type User struct {
	Id           primitive.ObjectID `bson:"_id"`
	Email        string             `bson:"email"`
	FamilyName   string             `bson:"family_name"`
	GivenName    string             `bson:"given_name"`
	Name         string             `bson:"name"`
	Picture      string             `bson:"picture"`
	Verified     bool               `bson:"verified"`
	AccessToken  string             `bson:"access_token"`
	RefreshToken string             `bson:"refresh_token"`
}

type GoogleUser struct {
	Email      string
	FamilyName string `json:"family_name"`
	GivenName  string `json:"given_name"`
	Name       string
	Picture    string
	Verified   bool
}

func InsertUser(db *mongo.Database, user GoogleUser, accessToken, refreshToken string) error {

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	mongoUser := User{
		Id:           primitive.NewObjectID(),
		Email:        user.Email,
		FamilyName:   user.FamilyName,
		GivenName:    user.GivenName,
		Name:         user.Name,
		Picture:      user.Picture,
		Verified:     user.Verified,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}
	existingUser, _ := GetUser(db, user.Email)
	if existingUser != nil {
		update := bson.D{primitive.E{Key: "$set", Value: bson.D{primitive.E{Key: "access_token", Value: accessToken}, primitive.E{Key: "refresh_token", Value: refreshToken}}}}
		if _, err := db.Collection("users").UpdateOne(ctx, bson.M{"email": user.Email}, update); err != nil {
			return err
		}
		return nil
	}
	if _, err := db.Collection("users").InsertOne(ctx, mongoUser); err != nil {
		return err
	}
	return nil
}

func GetUser(db *mongo.Database, email string) (*User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	var user *User
	err := db.Collection("users").FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if err != nil {
		return nil, err
	}
	return user, nil
}
