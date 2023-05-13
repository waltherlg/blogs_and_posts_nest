import { CommentsRepository } from "src/comments/comments.repository"
import { UsersRepository } from "src/users/users.repository"
import { PostsRepository } from "src/posts/posts.repository"
import { Injectable } from "@nestjs/common/decorators"

@Injectable()
export class LikeService {
    constructor(private readonly commentsRepository: CommentsRepository, 
        private readonly usersRepository: UsersRepository, protected usersQueryRepo: UsersQueryRepo, protected postsRepository: PostsRepository) {
    }

    async updateCommentLike(userId: string, commentsId: string, status: string): Promise<boolean>{
        const isUserAlreadyLikeComment = await this.usersRepository.isUserAlreadyLikeComment(userId, commentsId)
        if (!isUserAlreadyLikeComment){
            const createdAt = new Date()
            const isLikeAdded = await this.usersRepository.createCommentsLikeObject(userId, commentsId, createdAt, status)
            const setCount = await this.commentsRepository.setCountCommentsLike(commentsId, status)
            return isLikeAdded
        }
        const likedComments = await this.usersRepository.getUsersLikedComments(userId)
        if (!likedComments) return false
        const comment = likedComments.find(c => c.commentsId === commentsId)
        const currentStatus = comment ? comment.status : null
        console.log('CurrentStatus ' + currentStatus)

        if(currentStatus !== status){
            await this.usersRepository.updateCommentsLikeObject(userId, commentsId, status)
            if(currentStatus === "None" && status === 'Like'){
                await this.commentsRepository.increaseCommentsLikes(commentsId)
            }
            if(currentStatus === "None" && status === 'Dislike'){
                await this.commentsRepository.increaseCommentsDislikes(commentsId)
            }
            if(currentStatus === 'Like' && status === 'None'){
                await this.commentsRepository.decreaseCommentsLikes(commentsId)
            }
            if(currentStatus === 'Dislike' && status === 'None'){
                await this.commentsRepository.decreaseCommentsDislikes(commentsId)
            }
            if(currentStatus === 'Like' && status === 'Dislike'){
                await this.commentsRepository.decreaseCommentsLikes(commentsId)
                await this.commentsRepository.increaseCommentsDislikes(commentsId)
            }
            if(currentStatus === 'Dislike' && status === 'Like'){
                await this.commentsRepository.decreaseCommentsDislikes(commentsId)
                await this.commentsRepository.increaseCommentsLikes(commentsId)
            }
            return true
        } else return true
    }
}