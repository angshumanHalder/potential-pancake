package services

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type InvalidToken struct {
	Id    primitive.ObjectID `bson:"_id"`
	Token string             `bson:"token"`
}

func InsertInvalidToken(db *mongo.Database, token string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	invalidToken := InvalidToken{
		Id:    primitive.NewObjectID(),
		Token: token,
	}
	if _, err := db.Collection("invalid_tokens").InsertOne(ctx, invalidToken); err != nil {
		return err
	}
	return nil
}
