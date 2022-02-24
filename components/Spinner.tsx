import styled from "styled-components"

const Spinner = styled.svg`
  -webkit-animation: rotate 2s linear infinite;
  animation: rotate 2s linear infinite;
  z-index: 2;
  width: 20px;
  height: 20px;

  .path {
    /* stroke: #000; */
    stroke-linecap: round;
    -webkit-animation: dash 1.5s ease-in-out infinite;
    animation: dash 1.5s ease-in-out infinite;
  }

  @-webkit-keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
`

export default () => {
  return (
    <Spinner viewBox="0 0 50 50">
      <circle
        className="path dark:stroke-slate-50 stroke:slate-900"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="9"
      ></circle>
    </Spinner>
  )
}
