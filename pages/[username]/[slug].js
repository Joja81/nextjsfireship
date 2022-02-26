import styles from "../../styles/Post.module.css";

import PostContent from "../../components/PostContent";
import { firestore, postToJSON, getUserWithUsername, auth } from "../../lib/firebase";

import { useDocumentData } from "react-firebase-hooks/firestore";
import AuthCheck from "../../components/AuthCheck";
import Heart from "../../components/HeartButton";
import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../../lib/context";

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    //TODO deal with if url is incorrect
    const postRef = userDoc.ref.collection("posts").doc(slug);
    post = postToJSON(await postRef.get());

    path = postRef.path;
  }

  return {
    props: { post, path },
    revalidate: 5000,
  };
}

export async function getStaticPaths() {
  const snapshot = await firestore.collectionGroup("posts").get();

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
}

export default function Post(props) {
  const postRef = firestore.doc(props.path);
  const [realtimePost] = useDocumentData(postRef);

  const post = realtimePost || props.post;
  
  const { user: currentUser } = useContext(UserContext);

  return (
    <main className={styles.container}>
      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>

          <AuthCheck
            fallback={
              <Link href="/enter">
                <button>💗 Sign Up</button>
              </Link>
            }
          >
            <Heart postRef={postRef} />

            {currentUser?.uid === post.uid && (
              <Link href={`/admin/${post.slug}`}>
                <button className="btn-blue">Edit Post</button>
              </Link>
            )}

          </AuthCheck>
        </p>
      </aside>
    </main>
  );
}
